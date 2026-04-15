const crypto = require('crypto')
const prisma = require('../../lib/prisma')

const SESSION_DAYS = 7
const SCRYPT_KEY_LENGTH = 64

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString('hex')
  return `scrypt:${salt}:${derivedKey}`
}

function verifyPassword(password, storedHash) {
  const [algorithm, salt, hash] = String(storedHash || '').split(':')
  if (algorithm !== 'scrypt' || !salt || !hash) {
    return false
  }

  const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH)
  const storedKey = Buffer.from(hash, 'hex')
  return storedKey.length === derivedKey.length && crypto.timingSafeEqual(storedKey, derivedKey)
}

function serializeUser(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    telefone: usuario.telefone,
    papel: usuario.papel,
  }
}

async function createSession(usuarioId) {
  const token = crypto.randomBytes(32).toString('base64url')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS)

  await prisma.sessaoUsuario.create({
    data: {
      tokenHash: hashToken(token),
      expiresAt,
      usuarioId,
    },
  })

  return {
    token,
    expiresAt,
  }
}

async function verifyAuthToken(token) {
  if (!token) return null

  const session = await prisma.sessaoUsuario.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { usuario: true },
  })

  if (!session || session.expiresAt < new Date() || !session.usuario.ativo) {
    if (session) {
      await prisma.sessaoUsuario.delete({ where: { id: session.id } }).catch(() => {})
    }
    return null
  }

  return serializeUser(session.usuario)
}

class AuthService {
  async register(data) {
    const nome = String(data.nome || '').trim()
    const email = normalizeEmail(data.email)
    const telefone = data.telefone ? String(data.telefone).trim() : null
    const senha = String(data.senha || data.password || '')

    if (!nome) throw new Error('Nome do usuário é obrigatório')
    if (!email) throw new Error('Email do usuário é obrigatório')
    if (!email.includes('@')) throw new Error('Email inválido')
    if (senha.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres')

    const existing = await prisma.usuario.findUnique({ where: { email } })
    if (existing) throw new Error('Já existe um usuário com esse email')

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        telefone,
        senhaHash: hashPassword(senha),
      },
    })
    const session = await createSession(usuario.id)

    return {
      usuario: serializeUser(usuario),
      ...session,
    }
  }

  async login(data) {
    const email = normalizeEmail(data.email)
    const senha = String(data.senha || data.password || '')
    const usuario = await prisma.usuario.findUnique({ where: { email } })

    if (!usuario || !usuario.ativo || !verifyPassword(senha, usuario.senhaHash)) {
      throw new Error('Email ou senha inválidos')
    }

    const session = await createSession(usuario.id)
    return {
      usuario: serializeUser(usuario),
      ...session,
    }
  }

  async me(token) {
    const usuario = await verifyAuthToken(token)
    if (!usuario) throw new Error('Sessão inválida')
    return { usuario }
  }

  async logout(token) {
    if (!token) return
    await prisma.sessaoUsuario.deleteMany({ where: { tokenHash: hashToken(token) } })
  }
}

module.exports = new AuthService()
module.exports.verifyAuthToken = verifyAuthToken
