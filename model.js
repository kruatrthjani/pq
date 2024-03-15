const mongoose=require('mongoose')

const Schema=mongoose.Schema;
const dataSchema=new Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    contact:{
        type:String,
    },
    password:{
        type:String,
    },
    otps:{
        type:String,
        default:null,
    }
});

exports.DataModel=mongoose.model('User',dataSchema,'User')

