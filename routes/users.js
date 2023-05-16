const express = require('express')
const authenticateUser = require('../middleware/auth')
const authorizePermissions = require('../middleware/permission')
const { getAllUsers, userSearchByName } = require('../controllers/users')
const router = express.Router()

router.route('/')
.get(authenticateUser, authorizePermissions, getAllUsers)
.post(authenticateUser, authorizePermissions, userSearchByName)

module.exports = router