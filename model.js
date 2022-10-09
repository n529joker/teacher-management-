const mongoose = require('mongoose')
const teacherSchema = new mongoose.Schema({
    name:String,
    dob:Date,
    pob:String,
    sdo:String,
    do:String,
    ro:String,
    mat:String,
    subj:String,
    grade:String,
    dops:Date,
    num:Number,
    email:String
    // es:{
    //     data: Buffer,
    //     contentType: String
    // }
})

module.exports = new mongoose.model('teacher', teacherSchema)