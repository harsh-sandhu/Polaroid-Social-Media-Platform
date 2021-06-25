const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const User=mongoose.model('User')
module.exports = (req,res,next) =>{
    const {authorization} =req.headers
    if(!authorization){
        return res.status(401).json({error:"you must be logged in"})
    }
    const token=authorization.replace("Bearer ","")
    jwt.verify(token,process.env.JWT_SECRET,async (err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must be logged in"})
        }
        const {_id}=payload
        try{
            const foundUser=await User.findById(_id)
            if(foundUser){
                req.user=foundUser
                next()
            }
        }catch(err){
            console.log(err);
        }
    })
} 