const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
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
    phoneNumber: {
        type: String,
        required: [true, 'Please provide phone number']
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
    photo: String,
    role: {
        type: String,
        required: [true, 'Please provide user role'],
        default: 'user',
        enum: {
            values: ['staff', 'admin', 'user'],
            message: 'Please select valid role'
        }
    }

}, {timestamps: true})


// hash the password before saving it
UserSchema.pre('save', async function(next){

    // exit when login with google and facebook
    if (!this.password) return

    // exit the function when other fields are updated
    if(!this.isModified('password')) return

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.methods.getJWT = function(){
    const token = jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRATION
        }
    )
    return token
}

UserSchema.methods.comparePassword = async function(userPassword){
    const isMatch = await bcrypt.compare(userPassword, this.password)
    return isMatch
}

const UserModel = mongoose.model('User', UserSchema)
module.exports = {UserModel}