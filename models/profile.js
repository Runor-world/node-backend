const mongoose = require('mongoose')
const {ServiceCategorySchema} = require('./serviceCategory')
const SkillSchema = require('./skill')


const UserProfileSchema = new mongoose.Schema({
    backgroundPhoto: String,
    photo: String,
    bio: {
        type: String,
        maxlength: 200,
        default: 'Short description of who you are.'
    },
    birthday: {
        type: Date
    },
    city: String,
    country: String,
    user: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide user'],
        ref: 'User'
    }, 
})

const UserServiceProfileSchema = new mongoose.Schema({
    accountType: {
        type: String,
        enum: {
            values: ['service man', 'service consumer', 'business'],
            message: '{VALUE} is not supported'
        },
        default: 'service consumer'
    },
    service: {
        type: ServiceCategorySchema,
        message: 'Service is not supported'
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide user'],
        ref: 'User'
    }, 
})

const UserProfileModel = mongoose.model('profile', UserProfileSchema)
const UserServiceProfileModel = mongoose.model('userServiceProfile', UserServiceProfileSchema)

module.exports = {UserServiceProfileModel, UserProfileModel}