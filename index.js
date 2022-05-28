const express = require('express');
const app = express()
require("dotenv").config()
const cors = require('cors');
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



// App MiddleTear
app.use(cors())
app.use(express.json())


//  Routes
app.get('/', async (req, res) => {
    res.send("P-Hero Assignment 12 Server is Running")
})



// MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ok9qa4o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function run() {

    try {
        const partsCollection = client.db("p-hero-assignment-12").collection("parts")
        const orderCollection = client.db("p-hero-assignment-12").collection("orders")
        const reviewCollection = client.db("p-hero-assignment-12").collection("reviews")

        // Parts Routes
        app.get("/parts", async (req, res) => {
            const result = await partsCollection.find({}).toArray()
            res.send(result)
        })
        app.post("/parts", async (req, res) => {
            const parts = req.body
            const result = await partsCollection.insertOne(parts)
            res.send(result)
        })
        app.get("/parts/:id", async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await partsCollection.findOne(filter)
            res.send(result)
        })
        app.patch("/parts/:id", async (req, res) => {
            const parts = req.body
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: parts
            }
            const result = await partsCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })

        // Orders Routes
        app.get("/orders", async (req, res) => {
            const result = await orderCollection.find({}).toArray()
            res.send(result)
        })
        app.get("/orders/:id", async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await orderCollection.findOne(filter)
            res.send(result)
        })

        // Review Routes
        app.get("/reviews", async (req, res) => {
            const result = await reviewCollection.find({}).toArray()
            res.send(result)
        })
        app.post("/review", async (req, res) => {
            const review = req.body
            const result = await orderCollection.insertOne(review)
            res.send(result)
        })
    }
    finally {

    }

}
run()




app.listen(port, () => {
    console.log(`Server is listening on PORT : ${port}`);
})