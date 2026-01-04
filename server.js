const express = require('express');
require('dotenv').config();
const { sequelize } = require('./src/models');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');
const storeRoutes = require('./src/routes/storeRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'ok', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/store', storeRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established');
    
    await sequelize.sync({ alter: true });
    console.log('✓ Database synchronized');
    
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`
Available Endpoints:
- POST /api/inventory/upload
- GET  /api/store/:id/download-report
- CRUD /api/stores
- CRUD /api/authors
- CRUD /api/books
      `);
    });
  } catch (err) {
    console.error('✗ Unable to start server:', err);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});