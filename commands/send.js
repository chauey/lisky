module.exports = function sendCommand (vorpal) {
	'use strict';

	let config = require('../config.json');
	const lisk = require('lisk-js').api(config.liskJS);

	function checkRecipient (recipient) {
		return lisk.sendRequest('accounts', {  address: recipient });
	}

	vorpal
		.command('send <recipient> <amount>')
		.description('Send LSK to <recipient> <amount>')
		.action(function(userInput, callback) {

			const self = this;
			const recipient = checkRecipient(userInput.recipient);
			const address = userInput.recipient;
			const LSKamount = userInput.amount;

			recipient.then((result) => {

				if(result.error) {
					vorpal.log(result.error);

					return this.prompt({
						type: 'confirm',
						name: 'continue',
						default: false,
						message: 'This account is not known. Would you still like to continue?',
					}, function(result){
						if (!result.continue) {
							self.log('Good move.');
							callback();
						} else {
							self.log('Time to dust off that resume.');
							callback();
						}
					});
				} else {

					const balance = result.account.balance / 100000000;

					return this.prompt({
						type: 'confirm',
						name: 'continue',
						default: false,
						message: `You are sending ${userInput.amount} LSK to ${result.account.address} with a current balance of ${balance} LSK. Continue?`,
					}, function(result){
						if (!result.continue) {
							self.log('Cancelled.');
							callback();
						} else {
							return self.prompt({
								type: 'password',
								name: 'passphrase',
								message: 'Please type your passphrase to send: '
							}, function(passphrase) {

								if(!passphrase.passphrase) {
									self.log('Aborted.');
								}
								 else {
									let amount = +LSKamount * 100000000;
									lisk.sendLSK(address, amount, passphrase.passphrase, '', function (sendResult) {
										if(!sendResult.transactionId) {
											self.log(sendResult.message);
											callback();
										} else {
											self.log('Success. Your transactionId: '+sendResult.transactionId);
											callback();
										}

									});
								}

							});
						}
					});

				}

			});

		});

};
