const mongoose = require('mongoose')

async function connect(){
    try{
        await mongoose.connect('mongodb://localhost:27017/easyLevel')
    } catch(err){
        console.error("Error while connecting to mongoDB" , err.message)
    }
}

module.exports = connect
