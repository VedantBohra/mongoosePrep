const mongoose = require('mongoose')

const salesSchema = mongoose.Schema({
    product: String,
    amount : Number,
    region : String
})

const Sales = mongoose.model("Sales" , salesSchema)

module.exports = Sales