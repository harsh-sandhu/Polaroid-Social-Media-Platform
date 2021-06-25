const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const User=mongoose.model('User')
const bcrypt=require('bcryptjs')
const dotenv=require('dotenv')
const jwt=require('jsonwebtoken')
dotenv.config({path:'../config.env'})
const requireLogin=require('../middleware/requireLogin')
// const nodemailer=require('nodemailer')
// const sendgridTransport=require("nodemailer-sendgrid-transport")
// const transporter=nodemailer.createTransport(sendgridTransport({
//     auth:{
//         api_key:"
//     }
// }))

router.get('/protected',requireLogin,(req,res)=>{
    res.send("Hello")
})

router.post('/signup',async (req,res)=>{
    const {name,email,password,cpassword,profilepic}=req.body
    if(!name||!email||!password||!cpassword){
        return res.status(422).json({error:"Please fill all the fields"})
    }else if(cpassword!==password){
        return res.status(422).json({error:"Passwords donot match"})
    }
    try{
        const exist=await User.findOne({email:email});
        if(exist){
            return res.status(422).json({error:"User Already Exist"})
        }
        try{
            const hashedPass=await bcrypt.hash(password,12);
            if(hashedPass){
                const user= new User({
                    name,
                    email,
                    password:hashedPass,
                    profilepic
                })
                try{
                    const saved= await user.save();
                    if(saved){
                        // transporter.sendMail({
                        //     to:user.email,
                        //     from:"no-reply@polaroid.com",
                        //     subject:"signup success",
                        //     html:"<h1>welcome to Polaroid</h1>"
                        // })
                        res.json({message:"signedUp successfully"})
                    }else{
                        return res.status(422).json({error:"Error Occured"}) 
                    }
                }catch(err){
                    console.log(err);
                }
            }
        }catch(err){
            console.log(err);
        }
    }catch(err){
        console.log(err);
    }
})

router.post('/login',async (req,res)=>{
    const {email,password} = req.body
    if(!email||!password){
        return res.status(422).json({error:"Please fill all credentials properly"})
    }
    const exist=await User.findOne({email:email});
    try{
        if(!exist){
            return res.status(422).json({error:"User doesnot exist!!"})
        }
        try{
            const domatch=await bcrypt.compare(password,exist.password);
            if(!domatch){
                return res.status(422).json({error:"Invalid credentials"})
            }
            // const token =await exist.getAuthorizationToken()
            // res.cookie("polaroidjwt",token,{
            //     expires:new Date(Date.now()+ 86400000),
            //     httpOnly:true
            // })
            const token=jwt.sign({_id:exist._id},process.env.JWT_SECRET)
            res.json({token,user:exist});
        }catch(err){
            console.log(err);
        }
    }catch(err){
        console.log(err);
    }
})
module.exports = router;