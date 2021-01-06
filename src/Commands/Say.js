/* eslint-disable no-undef */
const Command = require('../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Repeats what you say',
			usage: '<message>'
		});
	}


	async run(message) {
		const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
		if (message.deletable) message.delete();

		if (args.length < 1) {
			// eslint-disable-next-line id-length
			return message.reply('Nothing to say????').then(m => m.delete(5000));
		}

		if (args[1].toLowerCase() === 'embed') {
			const embed = new MessageEmbed()
				.setColor(message.author.displayHexColor || 'BLUE')
				.setDescription(args.slice(2).join(' '));

			message.channel.send(embed);
		} else {
			message.channel.send(args.slice(1).join(' '));
		}

		return null;
	}

};
