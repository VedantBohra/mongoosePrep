const mongoose = require('mongoose')

// User2 schema to have email as a indexed field for faster query
const user2Schema = new mongoose.Schema({
    name: String,
    email: {type: String , unique: true, index: true, required: true},
    age: Number
})

const User2 = mongoose.model("User2" , user2Schema)

module.exports = User2