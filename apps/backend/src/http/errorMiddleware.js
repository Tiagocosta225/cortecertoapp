const { HttpError } = require('./httpError')

function normalizeError(error) {
  if (error instanceof HttpError) {
    return error
  }

  if (error?.message === 'Barbearia não encontrada') {
    return new HttpError(404, error.message)
  }

  if (error?.message === 'Esse horário já foi reservado') {
    return new HttpError(409, error.message)
  }

  return new HttpError(500, 'Erro interno do servidor')
}

function errorMiddleware(error, req, res, next) {
  const normalizedError = normalizeError(error)
  const payload = {
    error: normalizedError.message,
  }

  if (normalizedError.details) {
    payload.details = normalizedError.details
  }

  if (process.env.NODE_ENV !== 'production' && error?.stack) {
    payload.stack = error.stack
  }

  res.status(normalizedError.statusCode).json(payload)
}

module.exports = errorMiddleware
