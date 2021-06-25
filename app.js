const express= require('express')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'})
const PORT=process.env.PORT || 5000;
const DB=process.env.DATABASE;
//28LzS8buZ8mIgAgX

mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected',()=>{
    console.log("connection established with Atlas")
})
mongoose.connection.on('error',()=>{
    console.log("err conecting",err)
})
// .then(()=>{
//     console.log("connection established with Atlas")
// }).catch((err)=>console.log(err))
// app.get('/', (req,res)=>{
//     res.send("hello world");
// })

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static("client/build"))
}

app.listen(PORT,()=>{
    console.log("Server is running on port"+PORT);
})