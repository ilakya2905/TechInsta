const express = require('express')
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')
const mongoose = require('mongoose')
const PostModel = mongoose.model("Posts")

//creating posts post request
router.post('/createPost',requireLogin, (req,res) =>{
    const { title, body, picture} = req.body
    if(!title){
        return res.status(422).json({
            error: "post title is required"
        })
    }
    if(!body){
        return res.status(422).json({
            error: "post body is required"
        })
    }
    req.user.password = undefined // not sending the password back as response
    const post = new PostModel({
        title,
        body,
        picture,
        postedBy : req.user
    })
    post.save().then((response) =>{
        res.status(200).json({
            result : response
        })
    }).catch((error) =>{
        console.log("error",error)
    })


})

//get all posts get request
router.get('/allPosts',requireLogin,(req,res) =>{
    PostModel.find()
    .populate("postedBy", "_id name email")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then((posts) => {
        res.status(200).json({
            result: posts
        })
    }).catch((error) => {
        console.log("error",error)
    })
})

// @route   GET /getSubscribedPost
// @descp   get all the posts of my following
// @access  Private
router.get('/getSubscribedPost',requireLogin,(req,res) =>{
    //if postedBy in following
    PostModel.find({
        postedBy:{
            $in: req.user.following
        }
    })
    .populate("postedBy", "_id name email")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then((posts) => {
        res.status(200).json({
            result: posts
        })
    }).catch((error) => {
        console.log("error",error)
    })
})

//get my posts get request
router.get('/myPost',requireLogin,(req,res) =>{
    PostModel.find({
        postedBy : req.user._id
    }).populate("postedBy","_id name email ")
    .then((myPosts) =>{
        res.status(200).json({
            result : myPosts
        })
    }).catch((error) => {
        console.log("error",error)
    })
})

// @route   PUT /like
// @descp   add like
// @access  Private
router.put('/like',requireLogin,(req,res)=>{
    PostModel.findByIdAndUpdate(
        req.body.postId,{
            $push:{like:req.user._id}
        },{ 
            new: true
        }
    ).populate("postedBy", "_id name email").exec((error,result)=>{
        if(error){
            console.log(error)
            return res.status(422).json({
                error: error
            })
        }
        else{
            res.status(200).json(result)    
        }
    })
})

// @route   PUT /unLike
// @descp   remove like
// @access  Private
router.put('/unLike',requireLogin,(req,res)=>{

    PostModel.findByIdAndUpdate(
        req.body.postId,{
            $pull:{like:req.user._id}
        },{
            new: true
        }
    ).populate("postedBy", "_id name email").exec((error,result)=>{
        if(error){
            console.log(error)
            return res.status(422).json({
                error: error
            })
        }
        else{
            res.status(200).json(result)    
        }
    })
})

// @route   PUT /addComment
// @descp   add comment
// @access  Private
router.put('/addComment',requireLogin,(req,res)=>{

    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    PostModel.findByIdAndUpdate(
        req.body.postId,{
            $push:{comments:comment}
        },{
            new: true
        }
    ).populate("comments", "_id name email")
    .populate("comments.postedBy","_id name")
    .exec((error,result)=>{
        if(error){
            console.log(error)
            return res.status(422).json({
                error: error
            })
        }
        else{
            res.status(200).json(result)    
        }
    })
})

// @route   DELETE /deletePost/:postId
// @descp   delete Post
// @access  Private

router.delete('/deletePost/:postId', requireLogin, (req,res)=>{
    PostModel.findOne({
        _id:req.params.postId
    }).populate("postedBy","id name")
    .exec((error,result)=>{
        if(error || !result){
            return res.status(422).json({error})
        }
        if(result.postedBy._id.toString() === req.user._id.toString()){
            result.remove().then((result)=>{
                res.json(result).catch((error)=>{
                    res.status(422).json({error})
                })
            })
        } 
    })
})


module.exports = router