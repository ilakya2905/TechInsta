const express = require('express')
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')
const mongoose = require('mongoose')
const PostModel = mongoose.model("Posts")
const UserModel = mongoose.model("User")


// @route   get /user/:id
// @descp   get user profile by id
// @access  Private

router.get('/user/:userId',requireLogin,(req,res)=>{
    UserModel.findOne({
        _id:req.params.userId
    }).select("-password")
    .then((user)=>{
        PostModel.find({
            postedBy:req.params.userId
        }).populate("postedBy","_id name email")
        .then((posts)=>{
            res.status(200).json({user,posts})
        }).catch((error)=>{
            res.status(422).json({
                error:error
            })
        })
    }).catch((error)=>{
        res.status(422).json({
            error:error
        })
    })
})


// @route   PUT /follow
// @descp   if a person folows another, following count and array of the 1 st person and follower count and array of the second person shd be added
// @access  Private

router.put('/follow',requireLogin,(req,res)=>{
    UserModel.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    }).populate("_id", "name id email")
    .select("-password").exec((error,result)=>{
        if(error){
            res.status(422).json({error})
        }
        UserModel.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{
            new:true
        }).select("-password").exec((error,data)=>{
            if(error){
                res.status(422).json({error})
            }
            res.json({
                user:data,
                followUser:result
            })

        })
    })
})

// @route   PUT /unfollow
// @descp   if a person un-folows another, following count and array of the 1 st person and follower count and array of the second person shd be removed
// @access  Private

router.put('/unfollow',requireLogin,(req,res)=>{
    UserModel.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    }).populate("_id", "name id email")
    .select("-password").exec((error,result)=>{
        if(error){
            res.status(422).json({error})
        }
        UserModel.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{
            new:true
        }).select("-password")
        .exec((error,data)=>{
            if(error){
                res.status(422).json({error})
            }
            res.json({
                user:data,
                unfollowUser:result
            })

        })
    })
})
// @route   put /updateProfilePicture
// @descp   updates user profile picture
// @access  Private

router.put('/updateProfilePicture', requireLogin, (req,res)=>{
    UserModel.findByIdAndUpdate(req.user._id,{
        $set:{profilePicture:req.body.profilePicture}
    },{
        new:true
    }).then((result)=>{
        res.json(result)
    }).catch((error)=>{
        console.log("error",error)
        res.status(422).json({
            error:"Profile Picture is not updated!"
        })
    })
})

router.post('/searchUsers',requireLogin,(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
        UserModel.find(
            {
                email :{$regex:userPattern}
            }
        )
        .select("_id email ")
        .then((users)=>{
            res.json(users)
        }).catch((error)=>{
            console.log(error)
            res.status(422).json(error)
        })
})


module.exports = router