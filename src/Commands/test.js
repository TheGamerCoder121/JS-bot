/* eslint-disable no-undef */
const Command = require('../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Random Test Cmd',
			usage: 'Nope'
		});
	}


	async run(message) {
		return message.channel.send(config.Moderation.muted_role);
	}

};
