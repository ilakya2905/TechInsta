const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const ProfileModel = mongoose.model("Profile")
const UserModel =  mongoose.model("User")
const requireLogin = require('../middleware/requireLogin')
const {check, validationResult} = require('express-validator')
const { route } = require('./post')


//create profile post api
router.post('/createProfile',[requireLogin,[
    check('firstName','First Name is required').not().isEmpty(),
    check('lastName','Last Name is required').not().isEmpty(),
    check('bio','User Bio is required').not().isEmpty(),
    check('skills','Skills are required').not().isEmpty(),
    check('status','Status is required').not().isEmpty()
]],(req,res) => {
    const errors = validationResult(req)
    const {
        firstName,
        lastName,
        phoneNumber,
        bio,
        youtube,
        facebook,
        instagram,
        twitter,
        gitHub,
        linkedIn,
        skills,
        status,
        company,
        experience,
        education
    } = req.body 
    if(!firstName || !lastName || !bio || !gitHub || !linkedIn || !skills || !status){
        return res.status(422).json({
            error: "Please fill all the required fields1!"
        })
    }
    let post =  {
        firstName,
        lastName,
        bio,
        status,
        company,
        phoneNumber
    }
    if(experience.length!=0){
        experience.map((item)=>{
            if(!item.title || !item.company || !item.from || !item.to){
                return res.status(422).json({
                    errors: "Please fill all the required fields2!"
                })
            }
        })
        post.experience = []
        post.experience = experience
    }
    if(education.length!=0){
        education.map((item)=>{
            if(!item.school || !item.degree || !item.from || !item.to){
                return res.status(422).json({
                    errors: "Please fill all the required fields3!"
                })
            }
        })
        post.education = []
        post.education = education
    }
    
    //just a sample to send error with express-validator
    // if(!errors.isEmpty()){
    //     return res.status(422).json({
    //         errors: errors.array()
    //     })
    // }
    
    
    post.social = {
        youtube,
        linkedIn,
        gitHub,
        twitter,
        instagram,
        facebook
    }
    post.user = req.user._id
    post.skills = skills.split(",").map(skill=>skill.trim())

    ProfileModel.findOne({
        user: req.user._id
    }).then((user)=>{
        if(user){
            ProfileModel.findOneAndUpdate({
                user:req.user._id
            },{
                $set: post
            },{
                new: true
            }).populate("user","_id name isProfile following followers email")
            .then((result)=>{
                return res.status(200).json({
                    result : result.user
                })
            }).catch((error)=>{
                console.log(error)
                return res.status(422).json({error})
            })
            
        }
        else{
            profile = new ProfileModel(post)
            profile.save()
            .then((response) => {
                UserModel.findOneAndUpdate({
                    _id: req.user._id},{
                    isProfile : true
                },{
                    new: true
                }).then((result)=>{
                    result.password = undefined
                    console.log(result)
                    return res.status(200).json({
                        result : result
                    })
                }).catch((error)=>{
                    console.log(error)
                    return res.status(422).json({error})
                })
            }).catch((error) =>{
                console.log("error",error)
                return res.status(422).json({
                    errors : error
                })    
            })
        }
    })
    
        

        


})

//view Profile get api
router.get('/getMyProfile',requireLogin,(req,res) =>{
    ProfileModel.find({
        user : req.user._id

    }).populate("user","_id name email ")
    .then((myProfile) =>{
        // if(!myProfile){
        //     res.status(400).json({error: "There is no Profile created by this user yet!"})
        // }
        res.status(200).json({
            result : myProfile
        })
    }).catch((error) => {
        console.log("error",error)
    })
})

// @route   GET /getUserProfile/:userId
// @descp   get user profile by user id
// @access  Private
router.get('/getUserProfile/:userId',[
    requireLogin,
    [
        check('userId','User Id is required!').not().isEmpty()
    ]
],(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log("error")
        return res.status(422).json({
            errors:errors.array()
        })
    }
    ProfileModel.find({
        user : req.params.userId
    }).populate("user","_id name email ")
    .then((myPosts) =>{
        if(myPosts.length==0){
            return res.status(422).json({
                error : "There is no profile created by this user yet!"
            })
        }
        res.status(200).json({
            result : myPosts
        })
    }).catch((error) => {
        console.log("error",error)
    })
})


module.exports = router