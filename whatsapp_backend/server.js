//importing
//app config
//middleware
//db config
// ???
//api routes
//listening

//const express = require('express');
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Rooms from './dbRooms';
import Pusher from 'pusher';
import Cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: '1096307',
    key: '1037de3504ae4e390190',
    secret: '500b5429485492847b5f',
    cluster: 'ap2',
    encrypted: true
  });

//middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(Cors());

const connection_url = 'mongodb+srv://admin:WxhR2LohTDRWglD2@cluster0.u9pjq.mongodb.net/whatsappDB?retryWrites=true&w=majority'
mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;


db.once('open',()=> {
    console.log('new db connected')
    const roomsCollections = db.collection('rooms');
    const changeStream = roomsCollections.watch();

    changeStream.on('change',(change) => {
        if (change.operationType === 'insert'){
            const roomsDetails = change.fullDocument;
            pusher.trigger('chatRooms','inserted',{
                name:roomsDetails.name,
        });
        }
        else{
            console.log('error triggering pusher');
        }
    });
})



db.once('open',()=> {
    console.log('db connected')

    const msgCollection = db.collection('messagecontents');
    const changeStream = msgCollection.watch();

    changeStream.on("change",(change) => {

        if (change.operationType=== 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages','inserted',{
                nameId:messageDetails.nameId,
                name:messageDetails.name,
                message:messageDetails.message,
                timestamp:messageDetails.timestamp,
                received: messageDetails.received,
            });
        }
        else{
            console.log('error triggering pusher');
        }
    });
})
app.post('/rooms/new',(req,res) => {
    const dbRoom = req.body;
    Rooms.create(dbRoom,(err,data) => {
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(201).send(`new message created: \n ${data}`);
        }
    })
})
app.get('/rooms/sync',(req,res) => {
    Rooms.find((err,data) => {
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(200).send(data);
        }
    })
})


app.post('/messages/:roomId/new',(req,res) => {
    const dbMessage = req.body;
    Messages.create(dbMessage, (err,data) => {
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(201).send(`new message created: \n ${data}`);
           
        }
    })

})

app.get('/messages/:roomId/sync',(req,res) => {
    Messages.find((err,data) => {
        if (err){
            res.status(500).send(err);
        }
        else{
            res.status(200).send(data);
        }
    })
})

app.listen(port,() => {
    console.log(`app listening on port ${port}`)
});

export {db};