const mongoose = require('mongoose')

const SkillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide skill title'],
        maxlength: 30,
        minlength: 3,
    },
    active: {
        type: Boolean,
        default: true,
    }
})

module.exports = mongoose.model('skill', SkillSchema)

