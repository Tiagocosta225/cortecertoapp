const express = require('express')
const controller = require('./controller')
const asyncHandler = require('../../http/asyncHandler')

const router = express.Router()

router.get('/', asyncHandler(controller.index))
router.get('/:id', asyncHandler(controller.show))
router.post('/', asyncHandler(controller.create))
router.put('/:id', asyncHandler(controller.update))
router.delete('/:id', asyncHandler(controller.delete))

module.exports = router
