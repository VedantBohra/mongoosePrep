const mongoose = require('mongoose')

// many to many relationship with student and courses
const CourseSchema = mongoose.Schema({
    courseName: String,
    courseID : String,
    student : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }]
})

const Courses = mongoose.model("Courses" , CourseSchema)

module.exports = Courses