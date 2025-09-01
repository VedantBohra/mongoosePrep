const express = require('express')
const connect = require('./db')
const User = require('./schemas/User')
const Book = require('./schemas/Book')
const Post = require('./schemas/Post') 

const app = express()
connect()
app.use(express.json())

app.post('/user' , async (req , res) => {
    const user = req.body

    // Method 1
    // const saveUser =  new User(user)
    // await saveUser.save()

    // Method 2
    // const newUser = await User.insertOne(user)
    // await newUser.save()

    // Method 3 Personal favourite
    const newUser = await User.create(user)
    return res.status(200).json({msg: "User created" , newUser})
})

app.post('/book' , async (req , res) => {
    const booksArray = [{title: "book1" , author: "author1" , year: 2011},{title: "book1" , author: "author1" , year: 2009},
        {title: "book1" , author: "author1" , year: 2011},{title: "book1" , author: "author1" , year: 2008}
        ,{title: "book1" , author: "author1" , year: 2011},{title: "book1" , author: "author1" , year: 2007}
        ,{title: "book1" , author: "author1" , year: 2010},{title: "book1" , author: "author1" , year: 2006}
    ]
    const books = await Book.create(booksArray)
    return res.status(200).json({msg: "Books Added"})
})

app.get('/books' , async (req, res) => {
    const books = await Book.find({year: {$gt: 2010}})
    // findOne()
    // findById()
    // find().limit().sort({age: 1})

    return res.status(200).json({msg: " Books found" , books})
})

app.post('/updateAge' , async (req, res) => {
    const updatedObject = req.body
    const {email , age} = updatedObject

    const updatedUser = await User.updateOne({email} , {$set: {age}})
    return res.status(200).json({msg: "User is updated" , updatedUser})

    // updateMany()
    // findByIdAndUpdate() 
})

app.delete('/delete' , async(req , res) => {
    const deleted = await User.deleteMany({age : {$lt : 18}})
    return res.json({msg: "Users with less than age deleted" , deleted})

    // deleteOne()
    // findByIdAndDelete()
})

app.post('/post' , async (req,res) => {
    const post = req.body
    
    const newPost = await Post.create(post)
    return res.status(200).json({msg: "Post inserted" , post}) 
})

app.get('/post' , async (req,res) => {
    const post = await Post.findById("68b59410434be935b791e4e4")

    const createdAt = post.createdAt
    const updatedAt = post.updatedAt    
    return res.status(200).json({msg: "Here is your Post" , timeStamps: {createdAt , updatedAt}}) 
})

app.listen(3000 , () => {
    console.log('Listening at PORT 3000')
})