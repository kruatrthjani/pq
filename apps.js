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
function  pay(email,newPrice){
app.post('/create-payment-intent',async(req,res)=>{
    try{
        const{paymentMethodId}=req.body;
        let amount =newPrice;
        console.log("newPRice",amount,typeof(amount))
        console.log("newprice",newPrice)
        console.log("id=",paymentMethodId)
        console.log(email)
        const paymentIntent=await stripe.paymentIntents.create({
            amount:newPrice,
            currency:'usd',
            payment_method:paymentMethodId,
            confirmation_method:'manual',
            confirm:true,
            return_url:"http://localhost:3001/",
        });
        const findOrder=await OrderModel.findOne({email:email}).select("paid");
        if(findOrder.paid==false){
            console.log(typeof(findOrder))
            console.log(findOrder.toString())
        
        const updatedOrder = await OrderModel.updateOne(
            { email: email },
            { $set: { paid: true, paymentId: paymentMethodId } },
            { upsert: true }
        );
        if (!updatedOrder) {
            throw new Error("Failed to update order");
        }    
        
        console.log("Order updated successfully:", updatedOrder);
        res.status(200).json({ clientSecret: paymentIntent.client_secret });        
        
    }
    else{
        console.log('already paid')
    }
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Failed to update order" });
    }
});
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
}
module.exports={pay}