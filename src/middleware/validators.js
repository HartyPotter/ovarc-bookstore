const validateStore = (req, res, next) => {
  const { name, address } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Store name is required');
  }

  if (!address || address.trim().length === 0) {
    errors.push('Address is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false,
      errors 
    });
  }

  next();
};

const validateAuthor = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Author name is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false,
      errors 
    });
  }

  next();
};

const validateBook = (req, res, next) => {
  const { name, pages, authorId } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Book name is required');
  }

  if (!pages || pages < 1) {
    errors.push('Pages must be at least 1');
  }

  if (!authorId) {
    errors.push('Author ID is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false,
      errors 
    });
  }

  next();
};

const validateStoreBook = (req, res, next) => {
  const { storeId, bookId, price, copies } = req.body;
  const errors = [];

  if (!storeId) {
    errors.push('Store ID is required');
  }

  if (!bookId) {
    errors.push('Book ID is required');
  }

  if (price === undefined || price < 0) {
    errors.push('Valid price is required');
  }

  if (copies === undefined || copies < 0) {
    errors.push('Valid copies count is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false,
      errors 
    });
  }

  next();
};

module.exports = {
  validateStore,
  validateAuthor,
  validateBook,
  validateStoreBook
};