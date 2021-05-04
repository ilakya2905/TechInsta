const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {MONGOURI} = require('./config/key')
const PORT = process.env.PORT || 5000 //runs in the available port in production and runs in port 5000 in developemnet




mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log("Mongo DB running")
})
mongoose.connection.on('error',(err)=>{
    console.log("error in running MongoDB",err)
})

//schema
const userSchema = require('./models/user')
const postSchema = require('./models/post')
const ProfileSchema = require('./models/profile')



//routes
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/profile'))
app.use(require('./routes/user'))

//checks whether the running env is production and uses the files inside client/build folder
if(process.env.NODE_ENV == "production"){
    app.use(express.static('client/build'))
    const path = require('path')
    // at whatever request ->user must be navifated to client/build/index.html
    app.get("*", (req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


app.listen(PORT,() => {
    console.log("server running on port",PORT)
})