var expect = require('expect');
var {generateMessage} = require('./message');

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