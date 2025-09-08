const mongoose = require('mongoose')

const orderItemsSchema = new mongoose.Schema({
    product: String,
    quantity: Number
})

const orderitems = mongoose.model("orderitems" , orderItemsSchema)

module.exports = orderitems