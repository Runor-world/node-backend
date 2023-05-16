const { UnauthorizedError } = require("../errors")

const authorizePermissions = (req, res, next) =>{
    if(req.user.role !== 'admin'){
        throw new UnauthorizedError('Unauthorized access to this route')
    }
    next()
}

module.exports  = authorizePermissions