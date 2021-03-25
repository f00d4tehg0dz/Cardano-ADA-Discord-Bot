const request = require('request');
const options = {
	url: 'https://f00d.me/homegrown',
	method: 'GET',
	headers: {
		'Accept': 'application/json',
		'Accept-Charset': 'utf-8',
		'User-Agent': 'adaDiscordBot',
	},
};
const testClass = require('./helper.js');
module.exports = {
	name: 'ada',
	description: 'ADA Ticker',
	usage: 'Display ADA Latest Price',
	cooldown: 5,
	execute(message) {
		request(options, function(err, response, body) {
			if (err) {
				const error = 'cannot connect to the server';
				message.channel.send(error);
				message.channel.send('No results, check your spelling first');
			}
			else {
				const adaJSON = JSON.parse(body);
				const queryItem = 'ADA-USD';
				const stringPush = [];
				const filteredOrders = adaJSON.data.filter(item => item.Symbol === queryItem);
				for (const i in filteredOrders[0].Change) {
					stringPush.push(filteredOrders[0].Change[i]);
				}
				// const adaMessage = `${filteredOrders[0].Symbol}` + '\n';
				const adaMessageDesc = `${filteredOrders[0].LastPrice}` + '\n';
				const adaImage = 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Cardano_Logo.jpg';
				const adaURL = 'https://cardano.org/';
				const embed = {
					// 'title': `${adaMessage}`,
					'color': 51,
					'url': adaURL,
					'thumbnail': {
						'url': `${adaImage}`,
					},
					'fields': [
						{
							'name': 'Last Price:',
							'value': `${adaMessageDesc}`,
						},
						{
							'name': 'Volume:',
							'value': `${filteredOrders[0].Volume}`,
						},
						{
							'name': 'Change:',
							'value': `$${stringPush}%`,
						},
					],
					'footer': {
						'text': `${testClass.baseEmbedTemplate()[3]}`,
					},
				};
				message.channel.send({
					embed,
				});
			}
		});
	},
};
