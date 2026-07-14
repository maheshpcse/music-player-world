const logger = require('../utils/logger');

function errorHandler(error, req, res, _next) {
  const status = error.status || 500;
  const payload = {
    message: error.message || 'Something went wrong.',
    status
  };

  logger.error('Request failed', {
    request: {
      method: req.method,
      originalUrl: req.originalUrl
    },
    error: {
      message: error.message,
      stack: error.stack,
      status
    },
    response: payload
  });

  res.status(status).json(payload);
}

module.exports = { errorHandler };
