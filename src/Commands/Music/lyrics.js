/* eslint-disable no-unused-vars */
const { MessageEmbed } = require('discord.js');
const lyricsFinder = require('lyrics-finder');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ly'],
			category: 'Music',
			usage: '<lyrics>'
		});
	}

	async run(message, args) {
		const queue = message.client.queue.get(message.guild.id);
		if (!queue) return message.channel.send('There is nothing playing.', message.channel).catch(console.error);

		let lyrics = null;

		try {
			lyrics = await lyricsFinder(queue.songs[0].title, '');
			if (!lyrics) lyrics = `No lyrics found for ${queue.songs[0].title}.`;
		} catch (error) {
			lyrics = `No lyrics found for ${queue.songs[0].title}.`;
		}

		const lyricsEmbed = new MessageEmbed()
			.setAuthor(`${queue.songs[0].title} — Lyrics`, 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif')
			.setThumbnail(queue.songs[0].img)
			.setColor('YELLOW')
			.setDescription(lyrics)
			.setTimestamp();

		if (lyricsEmbed.description.length >= 2048) { lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`; }
		return message.channel.send(lyricsEmbed).catch(console.error);
	}

};
