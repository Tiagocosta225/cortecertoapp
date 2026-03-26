const express = require('express')
const controller = require('./controller')
const asyncHandler = require('../../http/asyncHandler')

const router = express.Router()

router.get('/barbearias/:slug', asyncHandler(controller.showBarbearia))
router.get('/barbearias/:slug/agenda', asyncHandler(controller.showAgenda))
router.post('/barbearias/:slug/agendamentos', asyncHandler(controller.createAgendamento))

module.exports = router
