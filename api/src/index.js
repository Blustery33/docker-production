const express = require('express');
const { MongoClient } = require('mongodb');

const MongUrl = process.env.NODE_ENV === 'production' ? `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PWD}@db` : `mongodb://db`

// const uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PWD}@db`;
let count;
let clientDb;
console.log(process.env)
const connectToDb = async () => {
    try {
        const client = await MongoClient.connect(MongUrl);
        console.log('CONNEXION DB OK');
        count = client.db('test').collection('count');
        clientDb = client;
        console.log('Collection count initialisée');
    } catch (err) {
        console.error('Erreur de connexion à la base de données:', err);
    }
};

connectToDb();

const app = express();

app.get('/favicon.ico', (req, res) => res.status(304));
app.get('/manifest.json', (req, res) => res.status(304));

app.get('/api/count', (req, res) => {
    count.findOneAndUpdate({}, { $inc: { count: 1 } }, { returnNewDocument: 'true', upsert: true }).then((document) => {
        const count = document.count;
        console.log('Nouveau compteur:', count);
        res.status(200).json(document ? document.count : 0);
    });
})

app.all('*', (req, res) => {
    res.status(404).end()
})

const server = app.listen(80);

process.addListener('SIGINT', () => {
    server.close((err) => {
        if(err) {
            process.exit(1)
        }else {
            if(clientDb){
                clientDb.close((err) => process.exit(err ? 1 : 0));
            } else {
                process.exit(0)
            }
        }
    })
})