const express = require('express')
const controller = require('./controller')
const asyncHandler = require('../../http/asyncHandler')

const router = express.Router()

router.post('/register', asyncHandler(controller.register))
router.post('/login', asyncHandler(controller.login))
router.get('/me', asyncHandler(controller.me))
router.post('/logout', asyncHandler(controller.logout))

module.exports = router
