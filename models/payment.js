const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
    status: {
        type: String, 
        enum: {
            values: ['paid', 'pending', 'not paid'],
            message: '{VALUE} is not a valid payment status',
            default: 'not paid'
        }
    }, 
    amount: {
        type: Number,
        default: 0
    }
}, {timestamps: true})


const PaymentModel = mongoose.model('Payment', PaymentSchema)
module.exports = PaymentModel