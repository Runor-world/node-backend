const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, 'Please provide rating'],
        default: 0
    },
    comment: {
        type: String,
        maxlength: 1000,
    }, 
    title: {
        type: String,
        maxlength: 50,
        required: [true, 'Please provide title']
    },
    service: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    }
}, {timestamps: true})

const ReviewModel = mongoose.model('Review', ReviewSchema)
module.exports = ReviewModel