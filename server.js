const express = require('express')
const connect = require('./db')
const User = require('./schemas/User')
const Book = require('./schemas/Book')
const Post = require('./schemas/Post') 
const Student = require('./schemas/Student')
const Courses = require('./schemas/Courses')
const User2 = require('./schemas/User2')
const Sales = require('./schemas/Sales')

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
    return res.status(200).json({msg: "Post inserted" , newPost}) 
})

// Created One to many relationship from One user to many post and user can be accessed from any post

app.get('/post' , async (req,res) => {
    // .populate() does the aggregation pipeline use by $lookup to get the user from the User ObjectId like joins in SQL
    // Basically {include : {user : true}} in prisma for any message which under the hood uses joins
    // Here .populate() act as a wrapper for $lookup of user within post through postID
    const post = await Post.findById("68b5f6e2f8a45f05a28caa89").populate("user")
  
    return res.status(200).json({msg: "Here is your Post" , post}) 
})

// student and courses many to many relationship
app.post('/student' , async (req , res) => {
    const studentBody = req.body

    const student = await Student.create(studentBody)
    return res.status(200).json({msg: "New student enrolled" , student})
})

app.post('/selectCourse' , async (req , res) => {
    // when a student select a course
    const {courseID , studentID} = req.body
    const course = await Courses.findByIdAndUpdate(courseID ,
         {$addToSet : {student : studentID}},
         {new: true}
        )
    
    const updatedStudent = await Student.findByIdAndUpdate(studentID , 
        {$addToSet : {courses: courseID}},
        {new: true}
    )
    return res.status(200).json({msg: "New student enrolled to course" , course , updatedStudent})
})

app.post('/course' , async (req , res) => {
    const courseBody = req.body

    const course = await Courses.create(courseBody)
    return res.status(200).json({msg: "New course enrolled" , course})
})

app.get('/course/:id' , async(req, res) => {
    const courseID = req.params.id
    const course = await Courses.findById(courseID).populate("student")

    return res.status(200).json({msg: "Course data" , course})
})

app.get('/student/:id' , async(req , res) => {
    const studentID = req.params.id
    const student = await Student.findById(studentID).populate("courses")

    return res.status(200).json({msg: "Student data" , student})
})

// User2 schema to have email as a indexed field for faster query
app.post('/User2' , async (req , res) => {
    const user = req.body
    const newUser = await User2.create(user)

    return res.status(200).json({msg: "User2 created" , newUser})
})

app.get('/User2' , async(req , res) => {
    const email = req.query.email

    const user = await User2.find({email}).explain("executionStats")

    return res.json({msg: "User found" , user})
})

app.post('/sales' , async (req , res) => {
    const sale = req.body
    const newSale = await Sales.create(sale)

    return res.status(200).json({msg: "Sale is successful" , newSale})
})

// aggregation pipeline to get the total sales per region
app.get('/getSale/:region' , async(req , res) => {
    // retrieving data for sales per region
    const {region} = req.params
    const totalSalesPerRegion = await Sales.aggregate([
        {$match: {region}}, // match acts like a find within aggregation pipeline
        {$group: {_id: '$region' , total: {$sum : '$amount'}}}, //when docs fields used as values of object here we write them like '$region'
    ])

    return res.status(200).json({msg: "Total sales have been done" , totalSalesPerRegion})
})

// pagination in server side with mongoose .limit() and .skip()
app.get('/paginatedPost/:userID' , async(req , res) => {
    const {page} = req.query
    const userID = req.params.userID
    const post = await Post.find({user: userID}).limit(1).skip(page).populate("user")

    return res.status(200).json({msg: "Post found" , post})
})

app.listen(3000 , () => {
    console.log('Listening at PORT 3000')
})