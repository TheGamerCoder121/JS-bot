const Command = require('../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Play rock, paper, scissors!',
			category: 'Fun',
			usage: '<rock|paper|scissors>'
		});
	}
	async run(message) {
		const args = message.content.slice(this.prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		const acceptedReplies = ['rock', 'paper', 'scissors'];
		const random = Math.floor(Math.random() * acceptedReplies.length);
		const result = acceptedReplies[random];

		const choice = args[0];
		if (!choice) return message.channel.send(`How to play: \`${this.prefix}rps <rock|paper|scissors>\``);
		if (!acceptedReplies.includes(choice)) return message.channel.send(`Only these responses are accepted: \`${acceptedReplies.join(', ')}\``);

		console.log('Bot Result:', result);
		if (result === choice) return message.reply("It's a tie! We had the same choice. 😁");

		switch (choice) {
			case 'rock': {
				if (result === 'paper') return message.reply('I won! 🤪');
				else return message.reply('You won! 😭');
			}
			case 'paper': {
				if (result === 'scissors') return message.reply('I won! 🤪');
				else return message.reply('You won! 😭');
			}
			case 'scissors': {
				if (result === 'rock') return message.reply('I won! 🤪');
				else return message.reply('You won! 😭');
			}
			default: {
				return message.channel.send(`Only these responses are accepted: \`${acceptedReplies.join(', ')}\``);
			}
		}
	}

};
