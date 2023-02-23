const mongoose = require('mongoose')

mongoose.set('strictQuery', true)
const connectDatabase = function(url){
    return mongoose.connect(url)
}

module.exports = connectDatabase