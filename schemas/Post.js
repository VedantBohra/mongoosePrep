const mongoose = require('mongoose')

const postSchema = mongoose.Schema({title: String , content: String},
    {timestamps: true}
)

const Post = mongoose.model('Post' , postSchema)

module.exports = Post