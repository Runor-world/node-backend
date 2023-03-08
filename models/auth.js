const mongoose = require('mongoose')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 2,
        maxlength: 50,
        required: [true, 'Please provide first name'],
        trim: true
    },  
    otherName: {
        type: String,
        minlength: 2,
        maxlength: 50,
        required: [true, 'Please provide other name'],
        trim: true
    },  
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
        required: [true, 'Please provide an email'],
        unique: [true, 'Someone is alreay using this email']
    },
    password: {
        type: String,
        minlength: 8,
        required: [true, 'Please provide password'],
        select: false
    },
    location: {
        type: String,
        minlength: 3,
        trim: true,
        default: 'my town'
    }, 
    verified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        length: 4,
    },
    photo: String
})

// hash the password before saving it
UserSchema.pre('save', async function(next){

    // exit when login with google and facebook
    if (!this.password) return

    // exit the function when other fields are updated
    if(!this.isModified('password')) return

    const salt = await bycrypt.genSalt(10)
    this.password = await bycrypt.hash(this.password, salt)
    next()
})

UserSchema.methods.getJWT = function(){
    const token = jwt.sign(
        {
            id: this._id,
            email: this.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRATION
        }
    )
    return token
}

UserSchema.methods.comparePassword = async function(password){
    const isMatch = await bycrypt.compare(password, this.password)
    return isMatch
}


module.exports = mongoose.model('User', UserSchema)