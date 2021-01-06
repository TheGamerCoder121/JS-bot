/* eslint-disable consistent-return */
/* eslint-disable no-inline-comments */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
const { Util, MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const ytdlDiscord = require('ytdl-core-discord');
var ytpl = require('ytpl');
const fs = require('fs');
const Command = require('../../Structures/Command');
const config = require('../../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pl'],
			description: 'To play songs :D',
			category: 'Music',
			usage: '<YouTube Playlist URL | Playlist Name>'
		});
	}

	async run(message, args) {
		const { channel } = message.member.voice;
		if (!channel) return message.channel.send("I'm sorry but you need to be in a voice channel to play music!");
		const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
		var searchString = args.join(' ');
		const permissions = channel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		if (!permissions.has('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');

		if (!searchString || !url) return message.channel.send(`Usage: ${config.prefix}playlist <YouTube Playlist URL | Playlist Name>`);
		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			try {
				const playlist = await ytpl(url.split('list=')[1]);
				if (!playlist) return message.channel.send('Playlist not found');
				const videos = await playlist.items;
				for (const video of videos) {
					// eslint-disable-line no-await-in-loop
					await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
				}
				return message.channel.send({
					embed: {
						color: 'GREEN',
						description: `✅  **|**  Playlist: **\`${videos[0].title}\`** has been added to the queue`
					}
				});
			} catch (error) {
				console.error(error);
				return message.channel.send('Playlist not found :(').catch(console.error);
			}
		} else {
			try {
				var searched = await yts.search(searchString);

				if (searched.playlists.length === 0) return message.channel.send('Looks like i was unable to find the playlist on YouTube');
				var songInfo = searched.playlists[0];
				const listurl = songInfo.listId;
				const playlist = await ytpl(listurl);
				const videos = await playlist.items;
				for (const video of videos) {
					// eslint-disable-line no-await-in-loop
					await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
				}
				const thing = new MessageEmbed()
					.setAuthor('Playlist has been added to queue', 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif')
					.setThumbnail(songInfo.thumbnail)
					.setColor('GREEN')
					.setDescription(`✅  **|**  Playlist: **\`${songInfo.title}\`** has been added \`${songInfo.videoCount}\` video to the queue`);
				return message.channel.send(thing);
			} catch (error) {
				return message.channel.send('An unexpected error has occurred').catch(console.error);
			}
		}

		async function handleVideo(video, message, channel, playlist = false) {
			const serverQueue = message.client.queue.get(message.guild.id);
			const song = {
				id: video.id,
				title: Util.escapeMarkdown(video.title),
				views: video.views ? video.views : '-',
				ago: video.ago ? video.ago : '-',
				duration: video.duration,
				url: `https://www.youtube.com/watch?v=${video.id}`,
				img: video.thumbnail,
				req: message.author
			};
			if (!serverQueue) {
				const queueConstruct = {
					textChannel: message.channel,
					voiceChannel: channel,
					connection: null,
					songs: [],
					volume: 80,
					playing: true,
					loop: false
				};
				message.client.queue.set(message.guild.id, queueConstruct);
				queueConstruct.songs.push(song);

				try {
					var connection = await channel.join();
					queueConstruct.connection = connection;
					play(message.guild, queueConstruct.songs[0]);
				} catch (error) {
					console.error(`I could not join the voice channel: ${error}`);
					message.client.queue.delete(message.guild.id);
					return message.channel.send(`I could not join the voice channel: ${error}`);
				}
			} else {
				serverQueue.songs.push(song);
				if (playlist) return;
				const thing = new MessageEmbed()
					.setAuthor('Song has been added to queue', 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif')
					.setThumbnail(song.img)
					.setColor('YELLOW')
					.addField('Name', song.title, true)
					.addField('Duration', song.duration, true)
					.addField('Requested by', song.req.tag, true)
					.setFooter(`Views: ${song.views} | ${song.ago}`);
				return message.channel.send(thing);
			}
			return;
		}

		async function play(guild, song) {
			const serverQueue = message.client.queue.get(message.guild.id);
			const afk = JSON.parse(fs.readFileSync('./afk.json', 'utf8'));
			if (!afk[message.guild.id]) {
				afk[message.guild.id] = {
					afk: false
				};
			}
			var online = afk[message.guild.id];
			if (!song) {
				if (!online.afk) {
					message.channel.send(`Leaving the voice channel because I think there are no songs in the queue. If you like the bot stay 24/7 in voice channel run '${config.prefix}afk'`);
					message.guild.me.voice.channel.leave();// If you want your bot stay in vc 24/7 remove this line :D
					message.client.queue.delete(message.guild.id);
				}
				return message.client.queue.delete(message.guild.id);
			}
			let stream = null;
			if (song.url.includes('youtube.com')) {
				stream = await ytdl(song.url);
				stream.on('error', (er) => {
					if (er) {
						if (serverQueue) {
							serverQueue.songs.shift();
							play(guild, serverQueue.songs[0]);
							return message.channel.send(`An unexpected error has occurred.\nPossible type \`${er}\``);
						}
					}
					return;
				});
			}

			serverQueue.connection.on('disconnect', () => message.client.queue.delete(message.guild.id));
			const dispatcher = serverQueue.connection
				.play(ytdl(song.url, { quality: 'highestaudio', highWaterMark: 1 << 25, type: 'opus' }))
				.on('finish', () => {
					const shiffed = serverQueue.songs.shift();
					if (serverQueue.loop === true) {
						serverQueue.songs.push(shiffed);
					}
					play(guild, serverQueue.songs[0]);
				});

			dispatcher.setVolume(serverQueue.volume / 100);
			const thing = new MessageEmbed()
				.setAuthor('Started Playing Music!', 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif')
				.setThumbnail(song.img)
				.setColor('BLUE')
				.addField('Name', song.title, true)
				.addField('Duration', song.duration, true)
				.addField('Requested by', song.req.tag, true)
				.setFooter(`Views: ${song.views} | ${song.ago}`);
			serverQueue.textChannel.send(thing);
		}
	}


};
