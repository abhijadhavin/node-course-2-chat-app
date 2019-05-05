var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
	it('should generate correct message Object', () => {
		var from = 'jen';
		var text = 'Some Message';
		var message = generateMessage(from, text);

		expect(message.createdAt).toBeGreaterThan(0);
		//expect(message).toHaveProperty({from, text});
		expect(message).toEqual(expect.objectContaining({from, text}));
	});
});

describe('generateLocationMessage', () => {
	it('should generate correct location Object', () => {
		var from = 'jen';
		var latitude =  15;
		var longtitude = 19;
		var url = 'https://www.google.com/maps?q=15,19';
		var message = generateLocationMessage(from, latitude, longtitude);

		expect(message.createdAt).toBeGreaterThan(0);
		//expect(message).toHaveProperty({from, text});
		expect(message).toEqual(expect.objectContaining({from, url}));
	})	
});