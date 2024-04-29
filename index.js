const http= require ('http');
const path=require("path")
const express=require('express');
const session = require('express-session');
const axios = require('axios');
const bcrypt = require('bcrypt');
const {encrypt,decrypt}=require("./passwordcryptography.js")
const hbs=require ("hbs")
const con=require("./connect.js")
const { connection, mongoose,db,collection } = require("./connect.js");
const{DataModel,ProductModel,OrderModel}=require("./model.js")
const isStrongPassword = require('./passwordvalidate.js');
const {mail,otptime} =require('./Mail.js')
const {pay} =require('./apps.js')
//const val=require('./passwordvalidate.js')
const app=express()
const port =process.env.PORT ||3000;
console.log("show=",isStrongPassword.constructor===Function)
app.use(express.json())
app.set('view engine','hbs')


//app.set('views', path.join(__dirname, 'views'));

//const uri = 'mongodb://localhost:27017';
/*mongoose.connect('mongodb://localhost:27017/test_db')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));*/


/*const server=http.createServer((req,res)=>{
    res.statusCode(200);
    res.end("hello world")
})
server.listen(port,hostname,()=>{
    console.log(`server is on port ${port} and host name ${hostname}`)
});*/
/*
try{
mongoose.connect('mongodb+srv://krutarth:fvueFLGO6rXE3ufE@cluster0.ofq8rqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {});
console.log("mongoose connected")
}
catch(e){
    console.log("fail to connect",e )
}*/
//const Schema = mongoose.Schema;

//const mongo = connection();
/*const dataSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    contact: {
        type: Number,
    },
    password: {
        type: String,
    }
});

const DataModel = mongoose.model('User', dataSchema,'User');*/
//module.exports=mongoose.model('User', dataSchema);
//const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  }));
  
  app.use((req, res, next) => {
    if (!req.session.user) {
      req.session.user = {}; 
    }
    next();
  });

app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/public/signup.hbs');
    
});
     /*   try{
            const passarr=data.password;
            passarr.isLength({ min: 6 })
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,)        
        }
        catch(e){
            console.log(e)            
        }*/
app.use(express.static('views'));
app.get("/submit",(req,res)=>{    
    res.render("signup")
});
app.post("/submit", async(req, res) => {
    const data={
      name:req.body.name,
     email:req.body.email,
     contact:req.body.contact,
     password:req.body.password,
     retypepassword:req.body.retypepassword,     
    }        
     try {                
       /* if (data.password !== data.retypePassword) {              
            res.render(__dirname + "/views/signup", {errname:"Passwords don't match"});    
          } else {        
            delete data.retypepassword;        
          }
         */ 
        //console.log(typeof (req.body.name))
            if(data.contact.length!=10)
            {
                res.status(400).send("entered contact number length is less than 10 digit");
                throw new Error('conact length must be  10');
            }            

            if(data.password == data.retypepassword)
            {
                delete data.retypepassword;
                console.log(data)
            }
            else
            {
                res.status(400).send("entered password are different");
                throw new Error('password are different');
            }                                  
              /*  const passarr=data.password;
                function isStrongPassword(passarr) 
                {
                    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;                            
                    return strongPasswordRegex.test(passarr);                            
                }                
                if(isStrongPassword(passarr)){
                    console.log('valid')
                }
                else{                    
                    res.status(400).send("invalid password");
                    throw new Error('password is bad');
                }     
/*                console.log(val)
                if (!val) {
                    res.status(400).send("Invalid password");
                    return; // Stop execution here
                }*/
                if (!isStrongPassword(data.password)) { 
                    res.status(400).send("Invalid password");
                    throw new Error('Invalid password');
                }
        console.log("before save")             
        try{
            let pass=data.password;
            console.log(pass)
            let tempo=await encrypt(pass);            
            data.password=tempo;
        }
        catch(e){
                console.log("error",e)
        }
        console.log(data)
        const collection = DataModel.collection;              
        //await newData.save();           
        collection.insertOne(data, (err, result) => {
            if (err) {
                console.error("Error inserting document:", err);
                // Handle error
            } else {
                console.log("Document inserted successfully:", result);
                // Document inserted successfully, continue with your logic
            }
        });        
    } 
    catch (error) {
        console.error("Error saving data to MongoDB:", error);
        res.status(500).send("Error saving data");
    }
});

app.post("/sendotp",async(req,res)=>{
try{
    let otp = Math.floor(100000+(Math.random()*900000));   
    const temp=req.body.email;     

    const collection = DataModel.collection;    
    req.session.user.email=temp
    console.log(req.session.user.email=temp)
    const em={
        email:temp
    }
    collection.findOne (em, async(err, result) => {
        if (err) {
            console.error("user not found:", err);            
        } else {                                 
            await mail(otp,temp)               
            console.log(otp)                   
            let otpt=otp.toString()   
            console.log(otpt)          
            collection.updateOne(em,{ $set: { otps:otpt }})
            function deleteotp() {
                collection.updateOne(em,{ $set: { otps:null }})
              }              
            setTimeout(deleteotp, 180000);
            console.log("otp sent successfully:", result);             
            res.status(200).send("verified")
            }               
     })     
    }
    catch(e){
        console.log("here is problem",e)
    }    
});

app.post("/confirmotp",(req,res)=>{
try{
        const collection=DataModel.collection;        
        const otp=req.body.otps;
        const email=req.session.user.email;
        console.log(email)
        const em={
            email:email,
            otps:otp
        }
        console.log(em)
        collection.findOne(em,(err,result)=>{
            if(err){
                console.log("something went wrong",err)
            }
            else{
                console.log("correct otp",result)
                function deleteotp() {
                    collection.updateOne(em,{ $set: { otps:null }})
                  }
                  deleteotp()                  
                  res.status(200).send("verified to new password")
            }
        })                
    }
    catch(e){
        console.log("not working")
    }
});  

app.post("/resendotp",async (req,res)=>{
    try{
        let otp = Math.floor(100000+(Math.random()*900000));   
        const collection=DataModel.collection;                
        const emails=req.session.user.email;
        console.log(emails)
            const em={
                email:emails
            }     
            let otpt=otp.toString()   
            console.log(otpt)          
            collection.findOne (em, async(err, result) => {
                if (err) {
                    console.error("user not found:", err);            
                } else {                                 
                    await mail(otp)               
                    console.log(otp)                   
                    let otpt=otp.toString()   
                    console.log(otpt)          
                    collection.updateOne(em,{ $set: { otps:otpt }})                   
                    function deleteotp() {
                        collection.updateOne(em,{ $set: { otps:null }})
                      }              
                    setTimeout(deleteotp, 180000);
                    console.log("otp sent successfully:", result);             
                    res.status(200).send("verified")
                    }               
             })     
        }
        catch(e){
            console.log("here is problem",e)
        }    
});
app.post("/newpassword",async(req,res)=>{
try{
    const response = await axios.post('http://localhost:3000/confirmotp');
    const status = response.status;
    console.log(status)
    if(status!=200){
        res.status(404).send("not verified")
    }
    else{
        const data={
            password:req.body.password,
            retypepassword:req.body.retypepassword
        }
        
        const emails=req.session.user.email;
        if(data.password != data.retypepassword)
        {
            res.status(400).send("entered password are different");
            throw new Error('password are different');
        }
        else
        {
            delete data.retypepassword;
            console.log(data)            
            const emails=req.session.user.email;
            const collection=DataModel.collection;
            const em={
                email:emails
            }
            if (!isStrongPassword(data.password)) { 
                res.status(400).send("Invalid password");
                throw new Error('Invalid password');
            }
            else{
                let pass;
                try{
                    pass=data.password;
                    console.log(pass)
                    let tempo=await encrypt(pass);            
                    pass=tempo
                }
                catch(e){
                        console.log("error",e)
                }
                console.log(data)                
            collection.updateOne(em,{$set:{password:pass}});
            res.status(200).send("new password setuped")
            }
        }   
    }
}
catch(e){
    console.log("error is caught",e)
}
});
app.post("/buynow",async(req,res)=>{
    try{    
        const product={
        pr_name:req.body.productname
    }

            let currentTime = new Date();
            let pr_dataObj;
            //const product_collection=ProductModel.collection();
            const pr_data = await ProductModel.findOne({ name: product.pr_name }).select('-_id')
            const d= new Date()
            if(pr_data){
            pr_dataObj = pr_data.toObject();
            console.log(req.session.user.email)
            pr_dataObj.email=req.session.user.email;
            pr_dataObj.isreceived=false;
            pr_dataObj.paid=false;
            pr_dataObj.delivery = new Date(currentTime.getTime() + (168 * 60 * 60 * 1000));
            console.log("here is below to insert")
            console.log(pr_dataObj)
            }
            
            const ordermodel=OrderModel.collection            
            if(!pr_data){
                res.status(404).send("not find")                
            }
            else{
                
                ordermodel.insertOne(pr_dataObj,(err,result)=>{
                    if(err){
                        console.error("Error inserting document:", err);
                    }
                    else{
                        console.log("Document inserted successfully:", result);
                    }
                });
                res.status(200).send("here it is"+pr_dataObj)
            }        
            
        }
    catch(e){
        console.log("product not found",e)
            res.status(404).send("product not found")
    }

});
app.post("/cart",async(req,res)=>{
try{
    const items=req.body.products.split(",")
    console.log(items)
    let currentTime = new Date();
    let pr_dataObj={};
    let pr_data=[]
    let amount=0
    for (let i = 0; i < items.length; i++) {
    const product = await ProductModel.findOne({ name: items[i] }).select('-_id');
    if (product) {
        pr_data.push(product);
        amount += product.newprice;
    } else {
        // Handle the case where the product with the given name is not found
        console.error(`Product not found for name: ${items[i]}`);
    }
}
    console.log("show it here",pr_data)
    console.log("amount",amount)
     if(pr_data){
        //pr_dataObj = pr_data.toObject();
        pr_dataObj.itemslist= pr_data        
        
        console.log(req.session.user.email)
        pr_dataObj.email=req.session.user.email;
        pr_dataObj.isreceived=false;
        pr_dataObj.delivery = new Date(currentTime.getTime() + (168 * 60 * 60 * 1000));
        pr_dataObj.amount=amount;
        console.log("here is below to insert")
        console.log(pr_dataObj)
    }
    const ordermodel=OrderModel.collection            
            if(!pr_data){
                res.status(404).send("not find")                
            }
            else{
                
                ordermodel.insertOne(pr_dataObj,(err,result)=>{
                    if(err){
                        console.error("Error inserting document:", err);
                    }
                    else{
                        console.log("Document inserted successfully:", result);
                    }
                });
                res.status(200).send("here it is"+pr_dataObj)
            }        
            
        }
    catch(e){
        console.log("product not found",e)
            res.status(404).send("product not found")
    }

});
app.get("/loginidentify",(req,res)=>{
    app.use(express.static('views'));
    res.render("login")
});
//const UserModel = mongoose.model('User', dataSchema);
app.post("/loginidentify",async(req,res)=>{
    try{
    const data={
        email:req.body.email,
        password:req.body.password,
    }        
        const passi=data.password;             
        delete data.password;        
        console.log(collection)
        const user = await DataModel.findOne({ email: data.email })
        console.log(user)
        const hash = user.password;
        console.log("hashed from database=",hash)
        let found = await decrypt(passi,hash)
        if(found){
            console.log("password matched",found)      ;   
            req.session.user.email=data.email
            res.status(200).send("go to home page");
        }
    } catch (error) {        
        console.error("Error retrieving data from MongoDB:", error);
        res.status(500).send("Internal Server Error");
    }
});
/*
app.post('/search', async (req, res, next) => {
    let search = req.body.search;
    req.session.user.search = search;

    try {
        const results = await ProductModel.aggregate([
            {
                $match: {
                    $or: [
                        { name: { $regex: new RegExp(search, 'i') } }
                    ]
                }
            }
        ]);                
        console.log(results);   
        if (!results || results.length === 0) {
            // Handle case where no matching documents are found
            console.log('No matching documents found');
            return res.status(404).send('No matching documents found');
        }

        req.session.user.results = results; // Store the results in the session for later use
        next();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}, async (req, res) => {
    const results = req.session.user.results;

    const contentType = results[0].imageData.contentType.data;
    const imageDataBuffers = results.map(result => result.imageData.data.buffer);
    const combinedImageData = Buffer.concat(imageDataBuffers);
    res.set('Content-Type', contentType);
    res.send(combinedImageData);
});
*/

app.post('/search', async (req, res, next) => {
    let search = req.body.search;
    req.session.user.search = search;
    console.log(search)
    try {
        const results = await ProductModel.aggregate([
            {
                $match: {
                    $or: [
                        { name: { $regex: new RegExp(search, 'i') } }
                    ]
                }
            }
        ]);                
        console.log(results);   
        if (!results || results.length === 0) {
            // Handle case where no matching documents are found
            console.log('No matching documents found');
            return res.status(404).send('No matching documents found');
        }

        req.session.user.results = results; // Store the results in the session for later use
        next();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}, async (req, res) => {
    const results = req.session.user.results;

    // Assuming all results have the same content type, get it from the first result
    if (results.length > 0 && results[0].imageData && results[0].imageData.contentType) {
        const contentType = results[0].imageData.contentType;
        res.set('Content-Type', contentType); // Set the content type
    } else {
        console.error("Content type is missing for results.");
        return res.status(500).send("Content type is missing for results.");
    }

    // Write the response body
    results.forEach(result => {
        if (!result || !result.imageData || !result.imageData.data) {
            console.error("Invalid result or imageData property missing.");
            return; // Skip this iteration if result or imageData is missing
        }
        
        var imageDataBuffer = result.imageData.data;
        const bufferData = Buffer.from(imageDataBuffer.buffer); // Convert Binary to Buffer
        res.write(bufferData);        
    });

    res.end(); // End the response
});
app.post('/payments', async (req, res) => {
    const email = req.session.user.email;
    console.log(email);
    let temp_ord={};
    const order = await OrderModel.findOne({ email: email }).select("newprice");
    if (order) {
        console.log("order", order);        
        temp_ord=order.toObject();
            console.log("order new price", temp_ord);
            console.log(temp_ord.newprice)
            const newPrice = await Number(temp_ord.newprice);
            console.log("New Price:", newPrice);            
            await pay(email, newPrice);
        
    } else {
        console.log("No order found for the specified email.");
    }    
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send('successfully logged out')
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});