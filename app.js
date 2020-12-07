
const express = require('express');
const socketio = require('socket.io');
const Config = require('./Config');
const handleConnections = require('./handleConnections');

const app = express();
const config = new Config;

app.use(express.static('public'));

const server = app.listen(config.port, function () {
  console.log(`http://localhost:${config.port}/`);
});

const io = socketio(server);
new handleConnections(io);
