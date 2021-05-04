const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types


//declare the schema
const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true,
    },
    email: {
        type : String,
        required: true,
    },
    password: {
        type : String,
        required: true,
    },
    followers:[{
        type: ObjectId,
        ref: "User"
    }],
    following:[{
        type:ObjectId,
        ref:"User"
    }],
    isProfile:{
        type:Boolean,
        default:false
    },
    resetToken:{
        type: String
    },
    expireToken:{
        type: Date
    },
    profilePicture:{
        type : String,
        default : "https://res.cloudinary.com/ilakya/image/upload/v1619932046/default_mc51fj.png"
    }
})
module.exports = mongoose.model("User",userSchema)
