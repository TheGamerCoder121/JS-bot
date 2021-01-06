/* eslint-disable no-unused-vars */
const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['l'],
			category: 'Music',
			usage: '<loop>'
		});
	}

	async run(message, args) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (serverQueue) {
			serverQueue.loop = !serverQueue.loop;
			return message.channel.send({
				embed: {
					color: 'GREEN',
					description: `🔁  **|**  Loop is **\`${serverQueue.loop === true ? 'enabled' : 'disabled'}\`**`
				}
			});
		}
		return message.channel.send('There is nothing playing in this server.', message.channel);
	}

};
