const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const UserModel = mongoose.model("User")
const {JWT_SECRET_KEY} = require('../config/key')
module.exports = (req,res, next) => {
    const {authorization} = req.headers
    //if no authorization in headers
    if(!authorization){
        res.status(401).json({
            error: "you must be logged in"
        })
    }
    const token = authorization.replace("Bearer ","")
    //verifying the provided token with the users orginal token
    jwt.verify(token,JWT_SECRET_KEY, (error,payload) => {
        if(error){
            //given token is invalid
            return res.status(401).json({
                error: "you must be logged in"
            })
        }
        const{_id} = payload
        UserModel.findById(_id).then((userData)=>{
            req.user = userData
            next()
        }).catch((error)=>{
            console.log("error",error)
        })
    })

}