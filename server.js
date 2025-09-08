const express = require('express')
const connect = require('./db')
const User = require('./schemas/User')
const Book = require('./schemas/Book')
const Post = require('./schemas/Post') 
const Student = require('./schemas/Student')
const Courses = require('./schemas/Courses')
const User2 = require('./schemas/User2')
const Order = require('./schemas/Order')
const Sales = require('./schemas/Sales')
const orderitems = require('./schemas/OrderItems')
const Message = require('./schemas/Message')
const MoneyUsers = require('./schemas/MoneyUsers')
const mongoose = require('mongoose')
const UserActivity = require('./schemas/UserActivity')

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

app.post('/createOrder' , async (req , res) => {
    const order = req.body
    const newOrder = await Order.create(order)

    return res.status(200).json({msg: "New Order" , newOrder})
})

// lookup query in aggregation pipeline
app.get('/getOrder' , async(req , res) => {
    const orderWithUser = await Order.aggregate([
        {$lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "orderDetails"
        }},
        // unwind query to flatten the array
        {$unwind: "$orderDetails"}
    ])

    return res.status(200).json({msg: "Order with details is here" , orderWithUser})
})

app.post('/createOrderItems' , async (req , res) => {
    const orderItems = req.body
    const newOrderItem = await orderitems.create(orderItems)

    return res.status(200).json({msg: "New order item created" , newOrderItem})
})

// Nested queries with group based on per product
app.get('/topOrderItems' , async (req , res) => {
    const topOrderItems = await orderitems.aggregate([
        {$group: {_id: '$product' , totalSold: {$sum: '$quantity'}}},
        {$sort: {totalSold: -1}},
        {$limit: 3}
    ])

    res.status(200).json({msg: "Top 3 order items" , topOrderItems})
})

app.post('/messageWithWord' , async(req , res) => {
    const message = req.body

    const newMessage = await Message.create(message)

    return res.status(200).json({msg: "New message is formed", newMessage})
})

// text and search query with meta relevance score priority
app.get('/messageWithWord/:word' , async(req , res) => {
    const word = req.params.word
    console.log(typeof word)
    const message = await Message.aggregate([
        {$match: {$text: {$search: word}}},
        {$project: {title: 1 , content: 1, score: {$meta: "textScore"}}},
        {$sort: {score: -1}}
    ])

    return res.status(200).json({msg: "Here is the returned message", message})
})

app.post('/createMoneyUser' , async (req, res) => {
    const moneyUser = req.body

    const newUser = await MoneyUsers.create(moneyUser)

    return res.status(200).json({msg: "New money user is created" , newUser})
})

app.post('/transaction', async (req, res) => {
  const { senderId, amount, receiverName } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Load sender document inside the session
    const sender = await MoneyUsers.findById(senderId).session(session);

    if (!sender) {
      throw new Error("Sender not found");
    }

    // Step 2: Check if sender has enough balance
    if (sender.balance < amount) {
      throw new Error("Insufficient balance");
    }

    // Step 3: Load receiver document
    const receiver = await MoneyUsers.findOne({ name: receiverName }).session(session);

    if (!receiver) {
      throw new Error("Receiver not found");
    }

    // Step 4: Deduct from sender
    await MoneyUsers.updateOne(
      { _id: senderId },
      { $inc: { balance: -amount } },
      { session }
    );

    // Step 5: Add to receiver
    await MoneyUsers.updateOne(
      { _id: receiver._id },
      { $inc: { balance: amount } },
      { session }
    );

    // Step 6: Commit
    await session.commitTransaction();

    return res.json({ msg: "Transaction Complete" });
  } catch (err) {
    await session.abortTransaction();
    return res.status(400).json({
      msg: "Couldn't complete the transaction",
      error: err.message
    });
  } finally {
    session.endSession();
  }
});

app.post('/userActivity' , async (req , res) => {
    const userActivity = req.body
    const newUserActivity = await UserActivity.create(userActivity)

    return res.status(200).json({msg: "New user activity added" , newUserActivity})
})

// Multiple complex queries with match , group , sort and limit
app.get('/userActivity' , async (req , res) => {
    const userActivity = await UserActivity.aggregate([
        {$match: {action: "login"}},
        {$group: {_id: '$userId', totalLogins: {$sum: 1}}},
        {$sort: {totalLogins: -1}},
        {$limit: 1}
    ])

    res.status(200).json({msg: "Most active user details" , userActivity})
})

app.listen(3000 , () => {
    console.log('Listening at PORT 3000')
})