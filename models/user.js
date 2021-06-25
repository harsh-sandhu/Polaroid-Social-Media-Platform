const mongoose= require('mongoose');
const {ObjectId}= mongoose.Schema.Types

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilepic:{
        type:String,
        default:'https://res.cloudinary.com/polaroid/image/upload/v1624616384/DefaultProfilePic_eu2mvx.jpg'
    },
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
    following:[{
        type:ObjectId,
        ref:"User"
    }]
})

// userSchema.methods.getAuthorizationToken = async function(){
//     try{
//         const token= jwt.sign({_id:this._id},process.env.JWT_SECRET)
//         this.tokens=this.tokens.concat({token:token})
//         await this.save()
//         return token
//     }catch(err){
//         console.log(err);
//     }
// }

mongoose.model("User",userSchema)