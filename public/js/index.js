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
	socket.emit('createMessage', {
	from: 'User',
	text: jQuery('[name=message]').val()
	}, function (message) {		 
	});
});

var locationButton = jQuery("#send-location");
locationButton.on('click', function(e) {
	e.preventDefault();
	if (!navigator.geolocation) {
	  return alert('geolocation not supported by your browser');
	} 
	navigator.geolocation.getCurrentPosition(function (postion) {		
		socket.emit('createLocationMessage', {
			latitude: postion.coords.latitude,
			longitude: postion.coords.longitude
		})
		console.log(postion);
	}, function(){
		alert('unable to fetch location')
	})
})