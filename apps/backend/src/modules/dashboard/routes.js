const express = require('express')
const controller = require('./controller')
const asyncHandler = require('../../http/asyncHandler')

const router = express.Router()

router.get('/barbearias/:id/overview', asyncHandler(controller.overview))
router.get('/barbearias/:id/agenda-inteligente', asyncHandler(controller.agendaInteligente))
router.get('/barbearias/:id/clientes-insights', asyncHandler(controller.clientesInsights))
router.get('/barbearias/:id/servicos-insights', asyncHandler(controller.servicosInsights))

module.exports = router
