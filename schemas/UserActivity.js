const mongoose = require('mongoose')

const userActivitySchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId , ref: "User"},
    action: {type: String , enum: ["login" , "logout" , "debit" , "credit"]}
} , {timestamps: true})

const UserActivity = mongoose.model("UserActivity" , userActivitySchema)

module.exports = UserActivity