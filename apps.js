require('dotenv').config();
const express= require('express')
const app =express();
const mongoose=require('mongoose')
const path=require('path');
const { OrderModel } = require('./model');
const port =process.env.PORT ||3001;
const stripe= require('stripe')(process.env.STRIPE_SECRET_KEY);
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')))
function  pay(email,amount){
app.post('/create-payment-intent',async(req,res)=>{
    try{
        const{paymentMethodId,amount}=req.body;
        const paymentIntent=await stripe.paymentIntents.create({
            amount:amount,
            currency:'usd',
            payment_method:paymentMethodId,
            confirmation_method:'manual',
            confirm:true,
            return_url:"http://localhost:3000/",
        });
        if(paymentIntent){
            OrderModel.update(
                // Query filter
                { email: email },
                // Update document
                { $set: { paid: true, paymentId:paymentMethodId} },
                // Options
                { upsert: true }
              );
        res.json({clientSecret:paymentIntent.client_secret});
    }
    }catch(error){
        console.error('Error creating payment',error)
        res.status(500).json({error:error.message});
    }
  });
}
module.exports={pay}
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});