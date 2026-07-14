const SENSITIVE_KEYS = new Set([
  'authorization',
  'cookie',
  'password',
  'password_hash',
  'passwordHash',
  'newPassword',
  'confirmPassword',
  'token',
  'jwt',
  'secret'
]);

function redact(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => redact(entry));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.entries(value).reduce((safeValue, [key, entry]) => {
    safeValue[key] = SENSITIVE_KEYS.has(key) ? '[REDACTED]' : redact(entry);
    return safeValue;
  }, {});
}

module.exports = { redact };
