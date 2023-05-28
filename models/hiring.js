const mongoose = require('mongoose')

const HiringSchema = new mongoose.Schema({
    serviceConsumer: {
        type: mongoose.Types.ObjectId, 
        required: [true, 'Please provide service consumer'],
        ref: 'User'
    }, 
    serviceProvider: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide service provider'],
        ref: 'User'
    }, 
    status: {
        type: String,
        enum: {
            values: ['pending', 'completed', 'in progress'], 
            message: '{VALUE} is not a valid status', 
            default: 'pending'
        },
        required: [true, 'Please provide status']
    }, 
    payment: {
        type: mongoose.Types.ObjectId,
        ref: 'Payment'
    }, 
    service: {
        type: mongoose.Types.ObjectId, 
        required: [true, 'Please provide service'],
        ref: 'serviceCategory'
    } 
}, {timestamps: true})


const HiringModel = mongoose.model('Hiring', HiringSchema)
module.exports = HiringModel