const express = require('express')
const authenticateUser = require('../middleware/auth')
const { getAllServiceMen, getServiceMan } = require('../controllers/serviceman')
const router = express.Router()

router.route('/').get(getAllServiceMen)
router.route('/:id').get(getServiceMan)

module.exports = router