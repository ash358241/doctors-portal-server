const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.suylw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
    res.send('assalamualikum');
});

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal").collection("appointments");
  //making api
  app.post('/addAppointment', (req, res) => {
      const appointment = req.body;
      console.log(appointment);
      appointmentCollection.insertOne(appointment)
      .then(result => {
          res.send(result.insertedCount > 0);
      })
  })

  app.post('/appointmentsByDate', (req, res) => {
    const date = req.body;
    console.log(date.date);
    appointmentCollection.find({date: date.date})
    .toArray((err, documents) => {
        res.send(documents);
    })
})

});

app.listen(process.env.PORT || port);