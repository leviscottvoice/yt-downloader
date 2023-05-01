const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    google_id:{
        type:String,
        require:true
    },
    token:{
        type:String,
        require:true
    },
    url:{
        type:String,
        require:true
    },
    sort:{
        type:Number,
        require:true
    }
})