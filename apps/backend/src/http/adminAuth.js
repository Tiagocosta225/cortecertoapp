const { HttpError } = require('./httpError')
const { verifyAuthToken } = require('../modules/auth/service')

async function requireAdminApiKey(req, res, next) {
  try {
    const authorization = req.headers.authorization || ''
    const bearerToken = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : ''
    if (bearerToken) {
      const usuario = await verifyAuthToken(bearerToken)
      if (usuario) {
        req.usuario = usuario
        return next()
      }
    }

    const configuredApiKey = process.env.ADMIN_API_KEY
    const providedApiKey = req.headers['x-admin-api-key']
    if (configuredApiKey && providedApiKey === configuredApiKey) {
      return next()
    }

    return next(new HttpError(401, 'Nao autorizado'))
  } catch (error) {
    return next(error)
  }
}

module.exports = requireAdminApiKey
