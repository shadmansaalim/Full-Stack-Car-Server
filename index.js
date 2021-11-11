//Imports
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;



//Middleware use for server
app.use(cors());
app.use(express.json());


//MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7qft9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        await client.connect();
        const database = client.db("fullStackCarApp");
        const carsCollection = database.collection("cars");
        const usersCollection = database.collection("users");
        const ordersCollection = database.collection("orders");

        //Get all cars
        app.get('/cars', async (req, res) => {
            const cursor = carsCollection.find({});
            let result;
            if (req?.query?.size) {
                const size = parseInt(req.query.size);
                result = await cursor.limit(size).toArray();
            }
            else {
                result = await cursor.toArray();
            }
            res.json(result);
        })

        //Get single car by unique id
        app.get('/car/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const car = await carsCollection.findOne(query);
            res.json(car);
        })

        //Add users to database those who signed up with Email Password
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

        //Add users to database those who signed up with External Provider
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        })




        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })

    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);








app.get('/', (req, res) => {
    console.log('Hitting backend');
    res.send('Car App Backend Coming Soon')
})

app.listen(port, () => {
    console.log('Listening to port number ', port);
})
