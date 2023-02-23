const BadRequestError = require('./bad-request')
const NotFoundError = require('./not-found')
const UnAuthenticatedError = require('./unauthenticated')
const CustomError = require('./custom-error')


module.exports = {
    BadRequestError,
    NotFoundError,
    UnAuthenticatedError,
    CustomError
}