const vorpal = require('vorpal')();
const common = require('../common');
const lisky = common.lisky;
const sinon = common.sinon;
const util = common.util;
const send = require('../../commands/send');
var mockCli = require('mock-cli');

vorpal.use(send);

vorpal
	.delimiter('lisky>')
	.show();

describe.skip('send', () => {

	it('should be a valid command', () => {

		let command = 'send 4554893625809998950L 10';

		let spy = sinon.spy(vorpal, 'exec');

		vorpal.exec(command, spy);

		(spy.called).should.be.equal(true);
		(spy.calledWith(command)).should.be.equal(true);

	});

});


describe('mocked send', () => {

	it('should be able to mock vorpal', () => {

		let command = 'send 4554893625809998950L 10';
		let spy = sinon.spy(send);

		vorpal.exec(command, spy);



	});

});