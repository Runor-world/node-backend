const {BadRequestError, UnauthenticatedError} = require('../errors')
const jwt = require('jsonwebtoken')

const authenticateUser = async (req, res, next) =>{
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new BadRequestError('Invalid authentication')
    }
    const token  = authHeader.split(' ')[1]
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {userID: decoded.id}
        next()
    }catch(error){
        console.log('token error:', error)
        throw new UnauthenticatedError('Unauthorized access')
    }
}

module.exports = authenticateUser