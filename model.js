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
        default: '',
        //index: { expires: 180, unique: true }
        //expiresAt: new Date(Date.now() + 120000),
    }
});

exports.DataModel=mongoose.model('User',dataSchema,'User')

