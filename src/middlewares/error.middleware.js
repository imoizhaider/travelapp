const ApiError = require('../utils/apiError');

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const statusCode = err.statusCode || 500;

  if (statusCode === 500) {
    console.error('[ERROR]', err.message);
    console.error('[STACK]', err.stack);
  }

  const payload = {
    success: false,
    message: err.message || 'Internal Server Error'
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (statusCode === 500 && !isProduction) {
    payload.stack = err.stack;
  }

  if (statusCode === 500 && isProduction) {
    payload.message = 'An unexpected error occurred';
  }

  res.status(statusCode).json(payload);
};

module.exports = {
  notFound,
  errorHandler
};