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
    birthday: Date,
    city: String,
    country: String,
    user: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide user']
    }, 
})

const UserServiceProfileSchema = new mongoose.Schema({
    accountType: {
        type: String,
        enum: {
            values: ['service provider', 'service consumer', 'both'],
            message: '{VALUE} is not supported'
        },
        default: 'service consumer'
    },
    serviceCategory: {
        type: ServiceCategorySchema,
        message: 'Service is not supported'
    },
    relatedSkills: {
        type: [SkillSchema.title],
        message: 'Skill is not supported'
    }
})

const UserProfileModel = mongoose.model('profile', UserProfileSchema)
const UserServiceProfileModel = mongoose.model('userServiceProfile', UserServiceProfileSchema)

module.exports = {UserServiceProfileModel, UserProfileModel}