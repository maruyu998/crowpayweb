const config = require('config');
const path = require('path');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongo_path);
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

const jsonParser = require('body-parser').json()
const session = require('express-session');

const express = require('express');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser'); 
const app = express();
// app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true,
        maxage: 1000 * 60 * 30
    }
}))


app.use('/manifest.json', express.static(path.join(__dirname, "../build/manifest.json")))
app.use('/robots.txt', express.static(path.join(__dirname, "../build/robots.txt")))

const basicAuth = require("express-basic-auth")

app.use(basicAuth({
    challenge: true,
    unauthorizedResponse: () => "Unauthorized",
    authorizer: (username, password) => {
        const userMatch = basicAuth.safeCompare(username, config.basic_auth_username);
        const passMatch = basicAuth.safeCompare(password, config.basic_auth_password);
        return userMatch && passMatch;
    }
}));


app.use('/api', jsonParser, require('./router.js'));
app.use(express.static(path.join(__dirname, "../build")))

app.listen(9200, ()=>{
    console.log('express app is listening')
});