const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const sockets = require('./sockets');
const bodyParser = require('body-parser');
const socketMiddlewares = require('./sockets/middlewares');
const mongoose = require('mongoose');
const requests = require('./requests');
const { cors } = require('./middlewares');
require('dotenv').config();

mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB}`, {
    useNewUrlParser: true,
    useCreateIndex: true
});

app.set('json spaces', 2);

// STATIC
app.use('/public', express.static('public'));

// CORS
app.use(cors);

// BODYPARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ROUTES
app.use(requests);

server.listen(5000);

global.io = io;
io.use(socketMiddlewares.verifyToken);
io.on('connection', sockets);