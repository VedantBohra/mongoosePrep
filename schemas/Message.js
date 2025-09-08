// Applying the text and search functionality
const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    title: String, 
    content: String, 
    },
    {timestamps: true}
)

messageSchema.index({title: 'text' , content: 'text'})

const Message = mongoose.model('Message' , messageSchema)

module.exports = Message