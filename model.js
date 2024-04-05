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

const productSchema = new mongoose.Schema({
    imageData: {
        filename: String,
        contentType: String,
        data: Buffer,
      },
    name: String,
    price:Number,
    brand:String,
    discount:Number,
    discountedprice:Number,
    newprice:Number,
    description: String
  });
  
const orderschema =new Schema({});
exports.DataModel=mongoose.model('User',dataSchema,'User')
exports.ProductModel=mongoose.model('Product',productSchema,'Product')
exports.OrderModel=mongoose.model('Order',orderschema,'Order')
