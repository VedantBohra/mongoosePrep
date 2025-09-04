const mongoose = require('mongoose')

// many to many relationship with student and courses
const StudentSchema = mongoose.Schema({
    studentName: String,
    studentID : String,
    courses : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
    }]
})

const Student = mongoose.model("Student" , StudentSchema)

module.exports = Student