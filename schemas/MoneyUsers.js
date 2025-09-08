const mongoose = require('mongoose')

const moneyUsersSchema = new mongoose.Schema({
    name: String,
    balance: Number
})

const MoneyUsers = mongoose.model("MoneyUsers" , moneyUsersSchema)

module.exports = MoneyUsers