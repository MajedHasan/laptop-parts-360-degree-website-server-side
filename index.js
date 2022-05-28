const express = require('express');
const app = express()
require("dotenv").config()
const cors = require('cors');
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken");



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

async function run() {

    try {
        await client.connect()
        const partsCollection = client.db("p-hero-assignment-12").collection("parts")
        const orderCollection = client.db("p-hero-assignment-12").collection("orders")
        const reviewCollection = client.db("p-hero-assignment-12").collection("reviews")
        const userCollection = client.db("p-hero-assignment-12").collection("users")
        const paymentCollection = client.db("p-hero-assignment-12").collection("payments")

        // Parts Routes
        app.get("/parts", async (req, res) => {
            const parts = await partsCollection.find().toArray()
            res.send(parts)
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
        app.delete("/parts/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await partsCollection.deleteOne(query)
            res.send(result)
        })

        // Orders Routes
        app.get("/orders", async (req, res) => {
            const result = await orderCollection.find().toArray()
            res.send(result)
        })
        app.post("/order", async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })
        app.get("/order/:id", async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await orderCollection.findOne(filter)
            res.send(result)
        })
        app.patch("/orders/:id", async (req, res) => {
            const id = req.params.id
            const order = req.body
            const filter = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: order
            }
            const result = await orderCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })
        app.delete("/order/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.send(result)
        })
        app.get("/orders/:email", async (req, res) => {
            const email = req.params.email
            // const decodedEmail = decoded.email
            const filter = { email: email }
            const result = await orderCollection.find(filter).toArray()
            console.log(email, result);
            res.send(result)
            // if (email === decodedEmail) {
            //     const filter = { email: email }
            //     const result = await orderCollection.find(filter).toArray()
            //     res.send(result)
            // }
            // else {
            //     res.status(403).send({ message: 'forbidden' })
            // }
        })

        // Review Routes
        app.get("/reviews", async (req, res) => {
            const result = await reviewCollection.find().toArray()
            res.send(result)
        })
        app.post("/review", async (req, res) => {
            const review = req.body
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })

        // Users Routes
        app.get("/users", async (req, res) => {
            const result = await userCollection.find().toArray()
            res.send(result)
        })
        app.put("/user/:email", async (req, res) => {
            const email = req.params.email
            const user = req.body
            const filter = { emall: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user
            }
            const result = await userCollection.updateOne(filter, updateDoc, options)
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ result, token })
        })
        app.get("/user/:email", async (req, res) => {
            const email = req.params.email
            const filter = { email: email }
            const user = await userCollection.findOne(filter)
            res.send(user)
        })
        // Admin Routes
        app.put('/user/admin/:email', async (req, res) => {
            const adminEmail = req.params.email
            const admin = await userCollection.findOne({ email: adminEmail })
            const isAdmin = admin.role === 'admin'

            if (isAdmin) {
                const email = req.body.email
                const filter = { email: email }
                const updateDoc = {
                    $set: { role: 'admin' }
                }
                const result = await userCollection.updateOne(filter, updateDoc)
                res.send(result)
            }

        })
        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email
            const user = await userCollection.findOne({ email: email })
            const isAdmin = user.role === 'admin'
            res.send({ admin: isAdmin })
        })

        // Payment Routes
        app.post("/payment", async (req, res) => {
            const payment = req.body
            const result = await paymentCollection.insertOne(payment)
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