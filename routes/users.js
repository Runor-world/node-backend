const express = require('express')
const authenticateUser = require('../middleware/auth')
const authorizePermissions = require('../middleware/permission')
const { getAllUsers } = require('../controllers/users')
const router = express.Router()

router.route('/').get(authenticateUser, authorizePermissions, getAllUsers)

module.exports = router