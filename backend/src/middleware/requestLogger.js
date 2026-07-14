const logger = require('../utils/logger');
const { redact } = require('../utils/redact');

function requestLogger(req, res, next) {
  const startedAt = Date.now();

  logger.info('Incoming request', {
    request: {
      method: req.method,
      originalUrl: req.originalUrl,
      ip: req.ip,
      headers: redact({
        authorization: req.headers.authorization,
        cookie: req.headers.cookie,
        contentType: req.headers['content-type'],
        userAgent: req.headers['user-agent']
      }),
      query: redact(req.query),
      params: redact(req.params),
      body: redact(req.body)
    }
  });

  const originalJson = res.json.bind(res);

  res.json = (payload) => {
    const statusCode = res.statusCode;
    const logLevel = statusCode >= 400 ? 'error' : 'info';

    logger[logLevel]('Outgoing response', {
      request: {
        method: req.method,
        originalUrl: req.originalUrl
      },
      response: {
        statusCode,
        durationMs: Date.now() - startedAt,
        body: redact(payload)
      }
    });

    return originalJson(payload);
  };

  next();
}

module.exports = { requestLogger };
