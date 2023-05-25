const express = require('express')
const authenticateUser = require('../middleware/auth')
const { getAllServiceMen } = require('../controllers/serviceman')
const router = express.Router()

router.route('/').get(getAllServiceMen)

module.exports = router