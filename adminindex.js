const express= require('express')
const mongoose=require('mongoose')
const multer= require('multer')
const fs= require('fs')
const path= require('path')
const con=require("./connect.js")
const { ProductModel } = require('./model.js')
const port=3000
const app = express()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use((express.json()))
app.use(express.urlencoded({extended:true}))
//app.post('/upload', upload.single('image'), async (req, res) => {
app.post('/productregister',upload.single('image'),async(req,res)=>{
try{
    const pr_data= new ProductModel({
        imageData: {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            data: req.file.buffer,
          },
        name:req.body.name,
        price:req.body.price,
        brand:req.body.brand,
        discount:req.body.discount,
        discountedprice:req.body.discountedprice,
        description:req.body.description,        
    });
    await pr_data.save();
    res.status(200).send('Object with image uploaded successfully');
}
catch(e){
    console.error('Error uploading object with image:', e);
    res.status(500).send('Error uploading object with image');

}
})


// Serve uploaded images statically
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Route to retrieve all products with associated image data
app.get('/products', async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).send('Error retrieving products');
  }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });