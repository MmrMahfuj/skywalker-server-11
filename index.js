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
        const bookingCollection = database.collection('bookings');

        //GET API all travel places
        app.get('/travelPlaces', async (req, res) => {
            const cursor = travelPlaceCollection.find({});
            const travelPlaces = await cursor.toArray();
            res.send(travelPlaces);

        })


        //GET API all bookings
        app.get('/bookings', async (req, res) => {

            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);

        })


        //GET Single travelPlace
        app.get('/travelPlaces/:id', async (req, res) => {
            console.log("thi the id");
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const travelPlace = await travelPlaceCollection.findOne(query)
            res.json(travelPlace);
        })

        // GET Email Bookings places
        app.get('/emailTravelPlaces/:email', async (req, res) => {
            const travelPlaces = await bookingCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(travelPlaces);
        });


        //POST API
        app.post('/travelPlaces', async (req, res) => {

            const travelPlace = req.body;
            // console.log('hit the post api',);

            const result = await travelPlaceCollection.insertOne(travelPlace);
            console.log(result);
            res.json(result);
        })

        // Booking post api
        app.post('/bookings', async (req, res) => {
            const booking = req.body;

            const result = await bookingCollection.insertOne(booking);
            console.log(result);
            res.json(result);
        })

        // update Status Bookings
        app.put('/statusBookings/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateStatus.status,
                },
            };
            const result = await bookingCollection.updateOne(filter, updateDoc, options)



            res.json(result);
        })

        //DELETE API travel place
        app.delete('/travelPlaces/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await travelPlaceCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        })

        //DELETE API bookings
        app.delete('/deleteBookings/:id', async (req, res) => {
            console.log('hitted the api');
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
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

// git push heroku main