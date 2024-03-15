const mongoose= require("mongoose")

//const connectionstring="mongodb+srv://krutarth:fvueFLGO6rXE3ufE@cluster0.ofq8rqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";    
const collection="User";
const db="ecom"
const productcollection="product"
const connection=async (con)=>{
try{
   const con=await mongoose.connect('mongodb+srv://krutarth:fvueFLGO6rXE3ufE@cluster0.ofq8rqs.mongodb.net/ecom?retryWrites=true&w=majority&appName=Cluster0', {}); 
   console.log("mongoose connected") 
    //const User=require("./index.js")    
    return con;       
    }
    catch(e){
        console.log("fail to connect",e )
        return e;
    }    
}
console.log(connection())
module.exports = { connection, mongoose,db ,collection};