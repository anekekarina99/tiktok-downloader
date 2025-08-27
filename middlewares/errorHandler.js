/**
 * Global error handling middleware for Express
 */
module.exports = (err, req, res, next) => {
  // Log error details for debugging
  console.error('🚨 Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Default error response
  let statusCode = err.statusCode || err.status || 500;
  let message = 'An unexpected error occurred. Please try again later.';
  let code = 'INTERNAL_ERROR';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Invalid input data';
    code = 'VALIDATION_ERROR';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid data format';
    code = 'CAST_ERROR';
  } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Service temporarily unavailable';
    code = 'SERVICE_UNAVAILABLE';
  } else if (err.code === 'ETIMEDOUT') {
    statusCode = 408;
    message = 'Request timeout. Please try again';
    code = 'TIMEOUT';
  }

  // Prepare error response
  const errorResponse = {
    error: message,
    code: code,
    timestamp: new Date().toISOString()
  };

  // Add additional details in development
  if (isDevelopment) {
    errorResponse.details = {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method
    };
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};
