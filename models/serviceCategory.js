const mongoose = require('mongoose')

const ServiceCategorySchema = new mongoose.Schema({
    name: {
        unique: [true, 'Service is alredy added'],
        type: String,
        required: [true, 'Please provide service name'],
        minlength: 3,
        maxlength: 30,
    },
    description: {
        type: String,
        minlength: 10,
        maxlength: 200,
        required: [true, 'Please provide service description']
    },
    active: {
        type: Boolean,
        default: true
    }
})

const ServiceCategoryModel = mongoose.model('serviceCategory', ServiceCategorySchema)

module.exports = {ServiceCategoryModel, ServiceCategorySchema}