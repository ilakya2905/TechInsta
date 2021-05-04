const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const profileSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number,
    },
    bio:{
        type: String,
        required: true
    },
    user:{
        type: ObjectId,
        ref: "User"
    },
    social:{
        youtube: {
            type: String
        },
        facebook: {
            type: String
        },
        twitter: {
            type: String
        },
        instagram: {
            type: String
        },
        linkedIn: {
            type: String,
            required: true
        },
        gitHub:{
            type: String,
            required: true
        }
    },
    experience:[
        {
            title:{
                type: String,
                required: true
            },
            company:{
                type: String,
                required: true
            },
            from:{
                type: String,
                required: true
            },
            to:{
                type: String,
                required: true
            }
        }
    ],
    education: [
        {
            school:{
                type: String,
                required: true
            },
            degree:{
                type: String,
                required: true
            },
            from:{
                type: String,
                required: true
            },
            to:{
                type: String,
                required: true
            }
        }
    ],
    skills:{
        type: [String],
        required: true
    },
    status:{
        type:String,
        required: true
    },
    company:{
        type: String,
    }
})

mongoose.model("Profile", profileSchema)