const http= require ('http');
const path=require("path")
const express=require('express');
const hbs=require ("hbs")
const con=require("./connect.js")
const { connection, mongoose,db,collection } = require("./connect.js");
const{DataModel}=require("./model.js")
const isStrongPassword = require('./passwordvalidate.js');
const {mail,otptime} =require('./Mail.js')
//const val=require('./passwordvalidate.js')
const app=express()
const port=3000;
console.log("show=",isStrongPassword.constructor===Function)
app.use(express.json())
app.set("view engine","hbs")
//app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}))

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
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/signup.html');
});


     /*   try{
            const passarr=data.password;
            passarr.isLength({ min: 6 })
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,)        
        }
        catch(e){
            console.log(e)            
        }*/

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
        //const newData = new DataModel(data);    
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
        
        res.render("home");
    } 
    catch (error) {
        console.error("Error saving data to MongoDB:", error);
        res.status(500).send("Error saving data");
    }
});
const emp={}
//for access to new password
app.post("/sendotp",async(req,res)=>{
try{
    let otp = Math.floor(100000+(Math.random()*900000));    
    const em={
    email:req.body.email,
    }
    emp.email=em.email;    
    /* Object.defineProperty(em,"email",{
        value:req.body.email,
    })
    Object.assign(em,{email:req.body.email})*/
    const collection = DataModel.collection;        
    collection.findOne (em, async(err, result) => {
        if (err) {
            console.error("user not found:", err);            
        } else {                                 
            await mail(otp)               
            console.log(otp)                   
            let otpt=otp.toString()   
            console.log(otpt)          
            collection.updateOne(em,{ $set: { otps:otpt}})
            console.log("otp sent successfully:", result); 
            emp.otps=otpt;
            const currentTime = new Date();        
            /*if((currentTime-otptime)>120000)
            {               
               collection.updateOne(em,
                { $set: { otp: otpt}}
            )
            } */           
        }
   
     })
    }
    catch(e){
        console.log("here is problem",e)
    }
});
app.post("/confirmotp",(req,res)=>{
    try{    
        emp.otps=req.body.otps;
        console.log(emp)
    const collection=DataModel.collection;        
        collection.findOne(emp,(err,res)=>{
            if(err){
                console.log("something went wrong",err)
            }
            else{
                console.log("correct",res)
            }
        })
    }
    catch(e){
        console.log("not working")
    }
})
app.post("/login",async(req,res)=>{
    res.render("login.hbs")
});
//const UserModel = mongoose.model('User', dataSchema);
app.post("/loginidentify",async(req,res)=>{
    const data={
        email:req.body.email,
        password:req.body.password,
    }
    try{
        
        let attr = await DataModel.findOne({email:data.email});        
        if (attr) {            
            if (attr.password === data.password) {
                res.render("homes");
            } else {
                res.send("Wrong password");
            }
        } else {            
            res.send("Wrong details whole");
        }
    } catch (error) {        
        console.error("Error retrieving data from MongoDB:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});