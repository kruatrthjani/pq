const http= require ('http');
const path=require("path")
const mongoose=require('mongoose');
const express=require('express');
const hbs=require ("hbs")



const app=express()
const port=3000;

const templatePath=path.join(__dirname,'../Newfolder')
app.use(express.json())
app.set("view engine","hbs")
app.set("views",templatePath)
app.use(express.urlencoded({extended:false}))

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
mongoose.connect('mongodb://localhost:27017/test_db', {
    

});
const Schema = mongoose.Schema;
const dataSchema = new Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    contact:{
        type:Number,
    }
});
const DataModel = mongoose.model('Data', dataSchema);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});



app.post("/submit", async(req, res) => {
    const data={
      name:req.body.name,
     email:req.body.email,
     contact:req.body.contact
    }
     try {        
        const newData = new DataModel(data);        
        await newData.save();        
        res.send("Data received successfully");
    } catch (error) {
        console.error("Error saving data to MongoDB:", error);
        res.status(500).send("Error saving data");
    }
});
    
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});