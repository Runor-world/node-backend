const {
    getAllServices,
    updateService, 
    createService
} = require('../controllers/service')

const express = require('express')
const authenticateUser = require('../middleware/auth')
const authorizePermissions = require('../middleware/permission')
const router = express.Router()

router.route('/').get(getAllServices).post(authenticateUser, authorizePermissions, createService).patch(authenticateUser, authorizePermissions, updateService)

module.exports = router