var socket = io();		

socket.on('connect', function(){
	console.log('Connected to server');	 	
});

socket.on('disconnect', function(){
	console.log('disconnected');
});

socket.on('newMessage', function(message) {
	console.log('New Message', message);
});

/*
socket.emit('createMessage', {
	from: 'Frank',
	text: 'Hi'
}, function (data) {
	console.log(data);
});
*/
jQuery("#message-from").on('submit', function(e){
	e.preventDefault();	
	socket.emit('createMessage', {
	from: 'User',
	text: jQuery('[name=message]').val()
	}, function (message) {
		console.log('new Message', message);
		var li = jQuery('<li></li>');		
		li.text(`${message.from}: ${message.text}`);
		jQuery('#messages').append(li);
	});
});