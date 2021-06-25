const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const Post=mongoose.model('Post')
const User=mongoose.model('User')
const requireLogin=require('../middleware/requireLogin')

router.get('/allpost',requireLogin,async (req,res)=>{
    try{
        const posts=await Post.find().populate("postedBy","_id name profilepic").sort("-createdAt")
        if(posts){
            res.json({posts})
        }
    }catch(err){
        console.log(err);
    }
})

router.get('/myfollowingpost',requireLogin,async (req,res)=>{
    try{
        const posts=await Post.find({postedBy:{$in:req.user.following}})
        .populate("postedBy","_id name profilepic").sort("-createdAt")
        if(posts){
            res.json({posts})
        }
    }catch(err){
        console.log(err);
    }
})

router.post('/addPost',requireLogin,async (req,res)=>{
    const {title,caption,photo}= req.body
    if(!title||!caption||!photo){
        return res.status(422).json({error:"Please add title and caption properly"})
    }
    req.user.password=undefined
    const post = new Post({
        title,
        caption,
        photo,
        postedBy:req.user
    })
    try{
        await post.save()
        res.json(post)
    }catch(err){
        console.log(err)
    }
})

router.get('/mypost',async (req,res)=>{
    try{
        const {user}=req.headers
        theuser=JSON.parse(user)
        const myposts=await Post.find({postedBy:theuser._id}).populate("postedBy","_id name profilepic")
        if(myposts){
            return res.json({myposts})
        }else{
            return res.status(422).json({error:"No post Found"})
        }
    }catch(err){
        console.log(err)
    }
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        name:req.user.name,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletePost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err||!post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString()===req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json("Post Deleted Successfully")
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

module.exports = router