/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const Command = require('../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Joins your current vc (gamers test cmd)',
			usage: '<message>'
		});
	}


	async run(message) {
		const args = message.content.split(' ');

		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			return message.channel.send(
				'You need to be in a voice channel to play music!'
			);
		}
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return message.channel.send(
				'I need the permissions to join and speak in your voice channel!'
			);
		}
		return null;
	}

};
