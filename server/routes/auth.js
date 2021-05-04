const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs') //for hashing passwords
const jwt = require('jsonwebtoken') // for creating web token 
const {JWT_SECRET_KEY} = require('../config/key')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
//models
const UserModel = mongoose.model("User")
const crypto = require('crypto')
const {RESET_PASSWORD_LINK,SENDGRID_KEY} = require('../config/key')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_KEY
    }
}))
//signUp post request
router.post('/signUp', (req,res) => {
    const {name, email, password,profilePicture} = req.body
    if(!name || !email || !password){
        return res.status(422).json({
            error: "All fields are required"
        })
    }
    else{
        
        UserModel.findOne({
            email : email
        }).then((savedUser) =>{
            if(savedUser){
                return res.status(422).json({
                    error: "user already exists with this email"
                })
            }
            UserModel.findOne({
                name : name
            }).then((savedUser) =>{
                if(savedUser){
                    return res.status(422).json({
                        error: "user name already exists"
                    })
                }
                bcrypt.hash(password,12)
                .then((hashedPassword) => {
                    const user = new UserModel({
                        name,
                        email,
                        password:hashedPassword,
                        profilePicture    
                    })
                    user.save().then((userDetails) => {
                        userDetails.password = undefined
                        res.send(userDetails)
                        transporter.sendMail({
                            to: userDetails.email,
                            from: 'techInsta101@gmail.com',
                            subject:"Hurray! Successfully Signed Up!!!!",
                            html: "<h1>Welcome to TechInsta</h1><br><br><h3>You are successfully signed up...Have fun with our application!!! Thank you</h3>"

                        }).then(()=>{
                        }).catch((error)=>{
                            console.log(error)
                        })
                        
                    }).catch((error)=>{
                        console.log("error",error)
                    })

                }).catch((error) =>{
                    console.log("error",error)
                })
            }).catch((error) =>{
                console.log("error",error)
            })

        }).catch((error) =>{
            console.log("error",error)
        })
    }
})

//signIn post request
router.post('/signIn',(req,res) => {
    const {email,password} = req.body
    UserModel.findOne({
        email : email
    }).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({
                error: "Invalid email or password"
            })
        }
        bcrypt.compare(password,savedUser.password)
        .then((isMatched) => {
            if(isMatched){

                const token = jwt.sign(
                    {_id: savedUser._id},
                    JWT_SECRET_KEY
                )
                savedUser.password = undefined
                return res.status(200).json({
                    token : token,
                    user: savedUser
                })

                
            }
            else{
                return res.status(422).json({
                    error: "Invalid email or password"
                })
            }
        }).catch((error)=>{
            console.log("error:",error)
        })
    }).catch((error)=>{
        console.log("error:",error)
    })
})



router.post('/resetPassword',(req,res)=>{
    if(!req.body.email){
        return res.status(422).json({
            error :  "Please provide the email"
        })
    }
    crypto.randomBytes(32,(error,buffer)=>{
        if(error){
            console.log(error)
        }
        else{
            const token = buffer.toString('hex')
            UserModel.findOne({
                email:req.body.email
            })
            .then((user)=>{
                if(!user){
                    return res.status(422).json({
                        error: "User doesnot exist!"
                    })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then(()=>{
                    transporter.sendMail({
                        to: req.body.email,
                        from: 'techInsta101@gmail.com',
                        subject:"Reset Password",
                        html: 
                        `<h1>Reset Password</h1><h3>Click this <a href="${RESET_PASSWORD_LINK}/${token}">Link</a> to reset your password.</h3>`
    
                    }).then(()=>{
                        res.json({
                            message: "Success"
                        })
                    }).catch((error)=>{
                        console.log(error)
                    })
                }).catch((error)=>{
                    console.log(error)
                    res.status(422).json({
                        error
                    })
                })
                
            }).catch((error)=>{
                console.log(error)
                res.status(422).json({
                    error
                })
            })
        }
    })
})

router.post('/updatePassword',(req,res) =>{
    if(!req.body.password){
        return res.status(422).json({
            error: "New Password is required!"
        })
    }
    UserModel.findOne({
        resetToken : req.body.token,
        expireToken:{
            $gt:Date.now() //checks the expire time is greater than current time
        }
    }).then((user)=>{
        if(!user){
            user.resetToken= undefined
            user.expireToken= undefined
            return res.status(422).json({
                error: "Session Expired. Try again!"
            })
        }
        bcrypt.hash(req.body.password,12).then((hashedPassword)=>{
            user.password= hashedPassword
            user.resetToken= undefined
            user.expireToken= undefined
            user.save().then((result)=>{
                res.json(result)
            }).catch((error)=>{
                console.log(error)
                res.status(422).json({
                    error
                })
            })
        }).catch((error)=>{
            console.log(error)
            res.status(422).json({
                error
            })
        })
    }).catch((error)=>{
        console.log(error)
        res.status(422).json({
            error
        })
    })
})
module.exports = router