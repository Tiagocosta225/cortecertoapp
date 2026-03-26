const { HttpError } = require('./httpError')

function requireAdminApiKey(req, res, next) {
  if (process.env.NODE_ENV !== 'production' && !process.env.ADMIN_API_KEY) {
    return next()
  }

  const configuredApiKey = process.env.ADMIN_API_KEY
  if (!configuredApiKey) {
    return next(new HttpError(500, 'ADMIN_API_KEY nao configurada'))
  }

  const providedApiKey = req.headers['x-admin-api-key']
  if (providedApiKey !== configuredApiKey) {
    return next(new HttpError(401, 'Nao autorizado'))
  }

  return next()
}

module.exports = requireAdminApiKey
