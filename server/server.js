'use strict';

const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const route = require('./route.js');

// client와 server에서 socket.io로 연결할 때 포트를 맞춰줘야 한다.
app.set('port', 8080);
// .listen(8082, () => { console.log('server start!'); });
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, '..', 'static')));
app.use('/', route);
server.listen(app.get('port'), function() {
  console.log('chat server start!');
});

const connect = require('./connection.js');
io.on('connection', socket => {
  connect(io, socket);
});
