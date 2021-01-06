/* eslint-disable no-unused-vars */
const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['np'],
			category: 'Music',
			description: 'To show the music which is currently playing in this server',
			usage: '<nowplaying>'
		});
	}

	async run(message, args) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing in this server.', message.channel);
		const song = serverQueue.songs[0];
		const thing = new MessageEmbed()
			.setAuthor('Now Playing', 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif')
			.setThumbnail(song.img)
			.setColor('BLUE')
			.addField('Name', song.title, true)
			.addField('Duration', song.duration, true)
			.addField('Requested by', song.req.tag, true)
			.setFooter(`Views: ${song.views} | ${song.ago}`);
		return message.channel.send(thing);
	}

};
