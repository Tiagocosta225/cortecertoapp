const { HttpError } = require('./httpError')

function normalizeError(error) {
  if (error instanceof HttpError) {
    return error
  }

  if (error?.code === 'P2002') {
    return new HttpError(409, 'Já existe um registro com esses dados')
  }

  if (error?.code === 'P2021' || error?.code === 'P2022') {
    return new HttpError(500, 'Banco de dados desatualizado. Execute as migrations do backend.')
  }

  if (error?.message === 'Barbearia não encontrada') {
    return new HttpError(404, error.message)
  }

  if (error?.message === 'Assinatura da barbearia inativa') {
    return new HttpError(402, error.message)
  }

  if (
    error?.message === 'Nome do serviço é obrigatório' ||
    error?.message === 'Barbearia é obrigatória para cadastrar o serviço' ||
    error?.message === 'Barbearia é obrigatória para cadastrar o agendamento' ||
    error?.message === 'Nome do cliente é obrigatório' ||
    error?.message === 'Telefone do cliente é obrigatório' ||
    error?.message === 'Barbearia é obrigatória para cadastrar o cliente'
  ) {
    return new HttpError(400, error.message)
  }

  if (
    error?.message === 'Email inválido' ||
    error?.message === 'Email do usuário é obrigatório' ||
    error?.message === 'Nome do usuário é obrigatório' ||
    error?.message === 'A senha deve ter pelo menos 6 caracteres'
  ) {
    return new HttpError(400, error.message)
  }

  if (error?.message === 'Já existe um usuário com esse email') {
    return new HttpError(409, error.message)
  }

  if (error?.message === 'Cada usuário pode cadastrar apenas uma barbearia') {
    return new HttpError(409, error.message)
  }

  if (
    error?.message === 'Usuário não encontrado' ||
    error?.message === 'Plano não encontrado' ||
    error?.message === 'Assinatura não encontrada'
  ) {
    return new HttpError(400, error.message)
  }

  if (error?.message === 'ASAAS_API_KEY não configurada') {
    return new HttpError(503, error.message)
  }

  if (error?.message === 'Email ou senha inválidos' || error?.message === 'Sessão inválida') {
    return new HttpError(401, error.message)
  }

  if (error?.message === 'Esse horário já foi reservado') {
    return new HttpError(409, error.message)
  }

  if (error?.message === 'Serviço não encontrado para essa barbearia') {
    return new HttpError(400, error.message)
  }

  if (
    error?.message === 'Horário fora do expediente da barbearia' ||
    error?.message === 'Não é possível agendar no passado' ||
    error?.message === 'Data inválida'
  ) {
    return new HttpError(400, error.message)
  }

  return new HttpError(500, 'Erro interno do servidor')
}

function errorMiddleware(error, req, res, next) {
  const normalizedError = normalizeError(error)
  const payload = {
    error: normalizedError.message,
    message: normalizedError.message,
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
