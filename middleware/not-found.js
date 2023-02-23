const {StatusCodes} = require('http-status-codes')

const notFound = (req, res, next) =>{
    res.status(StatusCodes.NOT_FOUND).send('Route not found')
}

module.exports = notFound