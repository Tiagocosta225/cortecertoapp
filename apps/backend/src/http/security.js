const { HttpError } = require('./httpError')

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for']
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim()
  }

  return req.ip || req.socket?.remoteAddress || 'unknown'
}

function setSecurityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  res.setHeader('X-DNS-Prefetch-Control', 'off')

  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  next()
}

function createCorsMiddleware() {
  const allowedOrigins = new Set(
    String(process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  )

  return function corsMiddleware(req, res, next) {
    const origin = req.headers.origin
    const forwardedProto = req.headers['x-forwarded-proto']
    const protocol = typeof forwardedProto === 'string' && forwardedProto
      ? forwardedProto.split(',')[0].trim()
      : req.protocol
    const host = req.headers['x-forwarded-host'] || req.headers.host
    const sameOrigin = host ? `${protocol}://${host}` === origin : false

    if (!origin) {
      return next()
    }

    if (!sameOrigin && allowedOrigins.size && !allowedOrigins.has(origin)) {
      return next(new HttpError(403, 'Origem nao autorizada'))
    }

    if (!sameOrigin && !allowedOrigins.size) {
      return next(new HttpError(403, 'Origem nao autorizada'))
    }

    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Api-Key')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')

    if (req.method === 'OPTIONS') {
      return res.status(204).end()
    }

    return next()
  }
}

function createRateLimitMiddleware(options = {}) {
  const windowMs = Number(options.windowMs || process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000)
  const max = Number(options.max || process.env.RATE_LIMIT_MAX || 300)
  const skip = typeof options.skip === 'function' ? options.skip : () => false
  const buckets = new Map()

  return function rateLimitMiddleware(req, res, next) {
    if (skip(req)) {
      return next()
    }

    const now = Date.now()
    const key = `${getClientIp(req)}:${req.path}`
    const current = buckets.get(key)

    if (!current || current.expiresAt <= now) {
      buckets.set(key, { count: 1, expiresAt: now + windowMs })
      return next()
    }

    if (current.count >= max) {
      res.setHeader('Retry-After', String(Math.ceil((current.expiresAt - now) / 1000)))
      return next(new HttpError(429, 'Limite de requisicoes excedido'))
    }

    current.count += 1
    return next()
  }
}

module.exports = {
  createCorsMiddleware,
  createRateLimitMiddleware,
  setSecurityHeaders,
}
