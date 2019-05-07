var socket = io();		

function scrollToBottom(){
	// Selectors
	var messages = jQuery("#messages");
	var newMessage = messages.children('li');	
	//Heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.scrollTop();
	var scrollHeight = messages.prop('scrollHeight');
	var	newMessageHeight = newMessage.innerHeight();
	var	lastMessageHeight = newMessage.prev().innerHeight();
	if(typeof lastMessageHeight === 'undefined' || lastMessageHeight === null) {
		lastMessageHeight = 0;
	}
	var to = clientHeight + scrollTop + newMessageHeight + lastMessageHeight;	
	if(to >= scrollHeight) {		
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect', function(){
	//console.log('Connected to server');	 	
	var params = jQuery.deparam(window.location.search);
	socket.emit('join', params, (err, ) => {
		if(err) {
			alert(err);
			window.location.href = '/'
		} else {
			console.log('No Error');
		}
	});
});

socket.on('disconnect', function(){
	console.log('disconnected');
});

socket.on('updateUserList', function (users) {
	//console.log('Users List', users);
	var ol = jQuery('<ol></ol>');

	users.forEach(function (user) {
		ol.append(jQuery('<li></li>').text(user));
	});

	jQuery("#users").html(ol);
});

socket.on('newMessage', function(message) {
	/*
	console.log('New Message', message);
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var li = jQuery('<li></li>');		
	li.text(`${message.from} ${formattedTime}: ${message.text}`);
	jQuery('#messages').append(li);
	*/
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#message-template').html();
	var html  = Mustache.render(template,{
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);
	scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
	/*
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var li = jQuery('<li></li>');		
	var a = jQuery('<a target="_blank"> My Current Location</a>')
	li.text(`${message.from} ${formattedTime}: `);
	a.attr('href', message.url);
	li.append(a);
	*/
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#location-message-template').html();
	var html  = Mustache.render(template, {
		text: message.text,
		from: message.from,
		url: message.url,
		createdAt: formattedTime
	});
	jQuery('#messages').append(html);
	scrollToBottom();
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