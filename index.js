const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zsx3s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run() {
    try {
        await client.connect();
        const database = client.db('SkyWalker');
        const travelPlaceCollection = database.collection('travelPlaces');

        //GET API
        app.get('/travelPlaces', async (req, res) => {
            const cursor = travelPlaceCollection.find({});
            const travelPlaces = await cursor.toArray();
            res.send(travelPlaces);

        })

        //GET Single travelPlace
        app.get('/travelPlaces/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await travelPlaceCollection.findOne(query)
            res.json(service);
        })

        //POST API
        app.post('/travelPlaces', async (req, res) => {

            const travelPlace = req.body;
            console.log('hit the post api',);

            const result = await travelPlaceCollection.insertOne(travelPlace);
            console.log(result);
            res.json(result);
        })

        // update Status
        app.put('/travelPlaces/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateStatus.status,
                },
            };
            const result = await travelPlaceCollection.updateOne(filter, updateDoc, options)



            res.json(result);
        })

        //DELETE API
        app.delete('/travelPlaces/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await travelPlaceCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('SkyWalker server is Running')
})

app.listen(port, () => {
    console.log('running SkyWalker server on port', port)
})