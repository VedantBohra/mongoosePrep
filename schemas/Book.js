const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
    title: String,
    author: String,
    year: Number
})

// Model is a wrapper which provide access to the database
const Book = mongoose.model("Book", bookSchema)

module.exports = Book