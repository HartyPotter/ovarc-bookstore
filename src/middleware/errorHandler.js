const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.errors.map(e => e.message)
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      error: 'Duplicate entry',
      details: err.errors.map(e => e.message)
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid reference',
      message: 'Referenced record does not exist'
    });
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      error: 'Database error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};