const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    amount: Number
})

const Order = mongoose.model("Order" , orderSchema)

module.exports = Order