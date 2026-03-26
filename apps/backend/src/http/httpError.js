class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.details = details
  }
}

function assertRequiredEnv(name) {
  const value = process.env[name]
  if (!value || !String(value).trim()) {
    throw new HttpError(500, `Variavel de ambiente obrigatoria ausente: ${name}`)
  }

  return value
}

module.exports = {
  HttpError,
  assertRequiredEnv,
}
