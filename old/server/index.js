import config from 'config';
import path from 'path';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import router from './router.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

mongoose.Promise = global.Promise;
mongoose.connect(config.mongo_path);
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: config.session_secret,
    store: MongoStore.create({
        mongoUrl: config.mongo_path,
        collectionName: 'sessions',
        autoRemove: 'native'
    }),
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        maxage: 1000 * 60 * 60 * 24 * 30
    }
}))

app.use('/manifest.json', express.static(path.join(__dirname, "../build/manifest.json")))
app.use('/robots.txt', express.static(path.join(__dirname, "../build/robots.txt")))

app.use('/api', bodyParser.json(), router);
app.use(express.static(path.join(__dirname, "../build")));

app.listen(9201, ()=>{
    console.log('express app is listening')
});