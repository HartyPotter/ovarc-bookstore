const { StoreBook, Store, Book, Author, sequelize } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const Papa = require('papaparse');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const LOGO_DIR = path.join(process.cwd(), 'uploads', 'logos');

function isHttpUrl(value) {
  return /^https?:\/\//i.test(value || '');
}

function normalizeLocalLogo(value) {
  if (!value) return null;
  if (value.startsWith('./')) return value.slice(2);
  if (value.startsWith('/')) return value.slice(1);
  return value;
}

async function downloadLogoToLocal(logoUrl, storeId) {
  await fs.promises.mkdir(LOGO_DIR, { recursive: true });

  const response = await fetch(logoUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch logo (status ${response.status})`);
  }

  const contentType = response.headers.get('content-type') || '';
  const ext = contentType.includes('png')
    ? 'png'
    : contentType.includes('jpeg') || contentType.includes('jpg')
      ? 'jpg'
      : 'png';

  const fileName = `store-${storeId}.${ext}`;
  const filePath = path.join(LOGO_DIR, fileName);
  const buffer = Buffer.from(await response.arrayBuffer());

  await fs.promises.writeFile(filePath, buffer);
  return path.relative(process.cwd(), filePath);
}

// POST /api/inventory/upload
// Upload CSV file with inventory data
exports.uploadInventory = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'CSV file is required'
    });
  }

  // Read and parse CSV file
  const csvContent = req.file.buffer.toString('utf-8');
  
  const parseResult = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_')
  });

  if (parseResult.errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'CSV parsing error',
      details: parseResult.errors
    });
  }

  const rows = parseResult.data;
  
  if (rows.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'CSV file is empty'
    });
  }

  const results = {
    processed: 0,
    storesCreated: 0,
    authorsCreated: 0,
    booksCreated: 0,
    inventoryCreated: 0,
    inventoryUpdated: 0,
    errors: []
  };

  // Process each row in a transaction
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNumber = i + 2; // Account for header row

    try {
      await sequelize.transaction(async (t) => {
        // Validate required fields
        if (!row.store_name || !row.book_name || !row.author_name) {
          throw new Error('Missing required fields: store_name, book_name, or author_name');
        }

        const price = parseFloat(row.price);
        const pages = parseInt(row.pages);

        if (isNaN(price) || price < 0) {
          throw new Error('Invalid price value');
        }

        if (isNaN(pages) || pages < 1) {
          throw new Error('Invalid pages value');
        }

        const logoRaw = (row.logo_url || row.logo)?.trim();
        const logoIsHttp = isHttpUrl(logoRaw);
        const logoLocalPath = !logoIsHttp && logoRaw ? normalizeLocalLogo(logoRaw) : null;

        // Find or create Store
        let store = await Store.findOne({
          where: { name: row.store_name.trim() },
          transaction: t
        });

        if (!store) {
          store = await Store.create({
            name: row.store_name.trim(),
            address: row.store_address?.trim() || 'N/A',
            logo: null
          }, { transaction: t });
          results.storesCreated++;
        }

        // Download and persist logo locally if provided and not already stored
        const shouldDownloadLogo = logoIsHttp && (!store.logo || isHttpUrl(store.logo));

        if (shouldDownloadLogo) {
          const savedPath = await downloadLogoToLocal(logoRaw, store.id);
          await store.update({ logo: savedPath }, { transaction: t });
        } else if (logoLocalPath && (!store.logo || isHttpUrl(store.logo))) {
          // Accept local path reference from CSV without downloading
          await store.update({ logo: logoLocalPath }, { transaction: t });
        }

        // Find or create Author
        let author = await Author.findOne({
          where: { name: row.author_name.trim() },
          transaction: t
        });

        if (!author) {
          author = await Author.create({
            name: row.author_name.trim()
          }, { transaction: t });
          results.authorsCreated++;
        }

        // Find or create Book
        let book = await Book.findOne({
          where: { 
            name: row.book_name.trim(),
            authorId: author.id
          },
          transaction: t
        });

        if (!book) {
          book = await Book.create({
            name: row.book_name.trim(),
            pages: pages,
            authorId: author.id
          }, { transaction: t });
          results.booksCreated++;
        }

        // find or create/update StoreBook
        let storeBook = await StoreBook.findOne({
          where: {
            storeId: store.id,
            bookId: book.id
          },
          transaction: t
        });

        if (storeBook) {
          // increment copies
          await storeBook.update({
            copies: storeBook.copies + 1,
            price: price,
            soldOut: false
          }, { transaction: t });
          results.inventoryUpdated++;
        } else {
          // Create new inventory entry
          await StoreBook.create({
            storeId: store.id,
            bookId: book.id,
            price: price,
            copies: 1,
            soldOut: false
          }, { transaction: t });
          results.inventoryCreated++;
        }

        results.processed++;
      });
    } catch (error) {
      results.errors.push({
        row: rowNumber,
        data: row,
        error: error.message
      });
    }
  }

  res.status(200).json({
    success: true,
    message: 'CSV import completed',
    summary: {
      totalRows: rows.length,
      processed: results.processed,
      failed: results.errors.length,
      storesCreated: results.storesCreated,
      authorsCreated: results.authorsCreated,
      booksCreated: results.booksCreated,
      inventoryCreated: results.inventoryCreated,
      inventoryUpdated: results.inventoryUpdated
    },
    errors: results.errors.length > 0 ? results.errors : undefined
  });
});