require('dotenv').config()
const express = require('express')
const routes = require('./routes')
const errorMiddleware = require('./http/errorMiddleware')
const { assertRequiredEnv } = require('./http/httpError')
const {
  createCorsMiddleware,
  createRateLimitMiddleware,
  setSecurityHeaders,
} = require('./http/security')

if (process.env.NODE_ENV === 'production') {
  assertRequiredEnv('DATABASE_URL')
  assertRequiredEnv('ADMIN_API_KEY')
}

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : false)
app.use(setSecurityHeaders)
app.use(createCorsMiddleware())
app.use(
  createRateLimitMiddleware({
    skip: (req) => req.path === '/health',
  })
)
app.use(express.json({ limit: '1mb' }))

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'backend',
  })
})

app.use(routes)
app.use('/api', routes)
app.use(errorMiddleware)

const port = Number(process.env.PORT || 3000)

const server = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})

function shutdown(signal) {
  server.close(() => {
    console.log(`Servidor encerrado por ${signal}`)
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
