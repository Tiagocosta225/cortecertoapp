const express = require('express')
const controller = require('./controller')
const asyncHandler = require('../../http/asyncHandler')
const requireAdminApiKey = require('../../http/adminAuth')

const router = express.Router()

router.post('/webhook/asaas', asyncHandler(controller.webhook))
router.use(requireAdminApiKey)
router.get('/plans', asyncHandler(controller.plans))
router.get('/subscription', asyncHandler(controller.subscription))
router.post('/checkout', asyncHandler(controller.checkout))
router.post('/cancel', asyncHandler(controller.cancel))

module.exports = router
