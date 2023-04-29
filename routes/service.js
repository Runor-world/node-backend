const {
    getAllServices,
    updateService, 
    createService
} = require('../controllers/service')

const express = require('express')
const authenticateUser = require('../middleware/auth')
const router = express.Router()

router.route('/').get(getAllServices, authenticateUser).post(createService, authenticateUser).patch(updateService, authenticateUser)

module.exports = router