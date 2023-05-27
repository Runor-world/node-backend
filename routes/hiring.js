const express = require('express')
const authenticateUser = require('../middleware/auth')
const { createHiring, getAllHiring } = require('../controllers/hiring')

const router = express.Router()

router.route('/').get(getAllHiring).post(authenticateUser, createHiring)


module.exports = router