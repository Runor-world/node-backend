const {StatusCodes} = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) =>{
    const customError = {
        message: err.message || 'Something went wrong',
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    }

    if(err.name == "ValidationError"){
        // handles missing fields
        customError.message = Object.values(err.errors)
        .map((item) => item.message)
        .join(', ');
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    if(err.code && err.code == 11000){
        // handles duplicate values error
        customError.message = `Duplicate value found for ${Object.values(err.keyValue)}.
        Please choose another value.
        `
        customError.statusCode = StatusCodes.BAD_REQUEST
    }
    if(err.name == "CastError"){
        customError.message = `No value found for id ${err.value}`
        customError.statusCode = StatusCodes.NOT_FOUND
    }

    res.status(customError.statusCode).json({msg: customError.message})
    
} 

module.exports = errorHandlerMiddleware