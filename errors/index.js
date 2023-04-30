const BadRequestError = require('./bad-request')
const NotFoundError = require('./not-found')
const UnAuthenticatedError = require('./unauthenticated')
const CustomError = require('./custom-error')
const UnauthorizedError = require('./unauthorized')

module.exports = {
    BadRequestError,
    NotFoundError,
    UnAuthenticatedError,
    CustomError,
    UnauthorizedError
}