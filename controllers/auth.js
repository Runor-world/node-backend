const UserModel = require('../models/auth')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')

const login = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        throw new BadRequestError('Please provide valid credentials')
    }

    const user = await UserModel.findOne({email})
    if(!user){
        throw new BadRequestError('Please provide valid credentials')
    }

    const isCorrectPassword = user.comparePassword(password)

    if(!isCorrectPassword){
        throw new UnAuthenticatedError('Please provide correct password')
    }

    const token = user.getJWT()
    res.status(StatusCodes.OK).json({user: user, token})
}

const register = async (req, res) =>{
    
    const existingUser = await UserModel.findOne({email: req.body.email})
    if(existingUser){
        throw new BadRequestError('Email is already registered')
    }
    const user = await UserModel.create({...req.body})
    
    res.status(StatusCodes.CREATED).json(
        {
            user: user,
            token: user.getJWT()
        }
    )
}

const updateUser = async(req, res) => {
    const {email, lastName, firstName, location, username} = req.body
    if(!email || !lastName || !firstName || !location  || !username){
        throw new BadRequestError('Please provide user values')
    }
    console.log(req.user)
    const user = await UserModel.findOne({_id: req.user.userID})

    // update values
    user.email = email
    user.firstName = firstName
    user.lastName = lastName
    user.location = location
    user.username = username

    await user.save()
    const token = user.getJWT()
    res.status(StatusCodes.OK).json({user, token})
}

const logout = async(req, res) => {
    if(req.user){
        req.logout()
        res.clearCookie("session", {path:"/",httpOnly:true})
        res.clearCookie("session.sig", {path:"/",httpOnly:true})
        
    }
    return res.redirect('https://runor.org')
}


const loginSuccess = async(req, res) => {
    if(req.user){
        res.status(200).json({
            success: true,
            message: 'Login success',
            user: req.user,
            token: req.user.getJWT()
        })
    }else{
        res.status(401).json({
            success: false,
            message: 'You are not logged in',
        })
    }
}

const loginFailure =  async(req, res) => {
    res.status(404).json({
        success: false,
        message: 'Login failed',
        user: false
    })
}

module.exports = {login, register, updateUser, logout, loginSuccess, loginFailure}