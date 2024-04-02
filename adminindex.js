const express= require('express')
const mongoose=require('mongoose')
const multer= require('multer')
const fs= require('fs')
const path= require('path')
const con=require("./connect.js")
const { ProductModel } = require('./model.js')
const port=3000
const app = express()
const uploadDir = path.join(__dirname, 'public/images');
fs.mkdirSync(uploadDir, { recursive: true }); 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use((express.json()))
app.use(express.urlencoded({extended:true}))
//app.post('/upload', upload.single('image'), async (req, res) => {
app.post('/productregister',upload.single('image'),async(req,res)=>{
try{
  let price=req.body.price;
  console.log(price)
  let discount=req.body.discount;
  console.log(discount)
  function discountedprice(){    
  let discounted=(price/100)*discount;
  return discounted;
  }
  let ds=discountedprice()
  console.log(ds)
    const pr_data= new ProductModel({
        imageData: {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            data: req.file.buffer,
          },        
          name:req.body.name,
          price:req.body.price,
          brand:req.body.brand,          
          discount:discount,
          discountedprice:ds,
          description:req.body.description,        
    });
    console.log(pr_data)
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
/*app.get('/route3/:param1', async (req, res) => {
  try {
    const param1 = req.params.param1;    

    // Construct the URLs with the provided parameters
    const route1URL = `/image/${param1}`;
    const route2URL = `/pr_img/${param}`;

    // Call route1 and route2 handlers simultaneously
    const result1Promise = new Promise((resolve, reject) => {
      app.handle({ method: 'GET', url: route1URL }, createMockResponse(resolve));
    });
    const result2Promise = new Promise((resolve, reject) => {
      app.handle({ method: 'GET', url: route2URL }, createMockResponse(resolve));
    });

    // Wait for both handlers to complete
    const [result1, result2] = await Promise.all([result1Promise, result2Promise]);

    // Send response combining results
    res.send(`Route 1: ${result1}, Route 2: ${result2}`);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

function createMockResponse(resolve) {
  return {
    send: function(data) {
      resolve(data);
    },
    status: function(statusCode) {
      return {
        send: function(data) {
          resolve({ statusCode, data });
        }
      };
    }
  };
}
*/
app.get('/image/:productId', async (req, res) => {
  try {
    // Retrieve image data from database
    const productId = req.params.productId;
    const product = await ProductModel.findById(productId);

    if (!product || !product.imageData) {
      return res.status(404).send('Image not found');
    }

    // Set appropriate headers and send image data
    res.set('Content-Type', product.imageData.contentType);
    res.send(product.imageData.data);
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).send('Error retrieving image');
  }
});

app.get('/pr_img/:productId', async (req, res) => {
  try {
    // Retrieve image data from database
    const productId = req.params.productId;
    const product = await ProductModel.findById(productId);

    if (!product || !product.imageData) {
      return res.status(404).send('Image not found');
    }

    // Set appropriate headers and send image data
    res.set('Content-Type', 'text/html');
    res.send(product);
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).send('Error retrieving image');
  }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });