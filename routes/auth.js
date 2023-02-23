const express = require('express')
const router = express.Router()

const {login, register, updateUser} = require('../controllers/auth')
const authenticateUser = require('../middleware/auth')

router.route('/login').post(login)
router.route('/register').post(register)
router.route('/update-user').patch(authenticateUser, updateUser)

module.exports = router