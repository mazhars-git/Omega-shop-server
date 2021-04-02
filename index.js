const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 4021;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cpoqr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.use(cors())
app.use(bodyParser.json())


client.connect(err => {
  const productCollection = client.db("oMegaShop").collection("products");
  const ordersCollection = client.db("oMegaShop").collection("orders");

  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })
  
  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('adding product', newProduct);
    productCollection.insertOne(newProduct)
    .then(result => {
      console.log(result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/product/:id', (req, res) => {
    productCollection.find({_id: ObjectID(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })

  app.delete('deleteProduct/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete this', id);
    productCollection.findOneAndDelete({_id: id})
    .then(document => res.send(!!document.value))
  })

  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  app.get('/orders', (req, res) => {
    ordersCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
  
});



app.listen(port)