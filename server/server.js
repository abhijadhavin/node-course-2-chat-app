const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');
	
	// Socket emait from Admin text welcome to the chat app
	socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));
	
	//Socket broadcast emit from admin new user joined
	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

	socket.on('createMessage', (message, callback) => {
		console.log('create Message', message);		
		io.emit('newMessage', generateMessage(message.from, message.text));	
		callback(message);	
	});

	socket.on('disconnect', () => {
		console.log('User was disconnect');
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});

