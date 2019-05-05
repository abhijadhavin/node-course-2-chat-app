var socket = io();		

socket.on('connect', function(){
	console.log('Connected to server');	 	
});

socket.on('disconnect', function(){
	console.log('disconnected');
});

socket.on('newMessage', function(message) {
	console.log('New Message', message);
	var li = jQuery('<li></li>');		
	li.text(`${message.from}: ${message.text}`);
	jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
	var li = jQuery('<li></li>');		
	var a = jQuery('<a target="_blank"> My Current Location</a>')
	li.text(`${message.from}: `);
	a.attr('href', message.url);
	li.append(a);
	jQuery('#messages').append(li);
});

jQuery("#message-from").on('submit', function(e){
	e.preventDefault();	
	var messageTextbox =  jQuery('[name=message]');
	socket.emit('createMessage', {
		from: 'User',
		text: messageTextbox.val()
	}, function (message) {		 
		messageTextbox.val('');
	});
});

var locationButton = jQuery("#send-location");
locationButton.on('click', function(e) {
	e.preventDefault();
	if (!navigator.geolocation) {
	  return alert('geolocation not supported by your browser');
	} 

	locationButton.attr('disabled', 'disabled').text('Sending location ...');
	navigator.geolocation.getCurrentPosition(function (postion) {	
		locationButton.removeAttr('disabled').text('Sending location');
		socket.emit('createLocationMessage', {
			latitude: postion.coords.latitude,
			longitude: postion.coords.longitude
		})
		console.log(postion);
	}, function(){
		locationButton.removeAttr('disabled').text('Sending location');
		alert('unable to fetch location')
	})
})