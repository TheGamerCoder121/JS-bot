/* eslint-disable no-unused-vars */
const fs = require('fs');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['24/7'],
			category: 'Music',
			usage: '<afk>'
		});
	}

	async run(message, args) {
		const afk = JSON.parse(fs.readFileSync('./afk.json', 'utf8'));
		if (!afk[message.guild.id]) {
			afk[message.guild.id] = {
				afk: false
			};
		}
		var serverQueue = afk[message.guild.id];
		if (serverQueue) {
			serverQueue.afk = !serverQueue.afk;
			message.channel.send({
				embed: {
					color: 'GREEN',
					description: `💤  **|**  AFK is **\`${serverQueue.afk === true ? 'enabled' : 'disabled'}\`**`
				}
			});
			return fs.writeFile('./afk.json', JSON.stringify(afk), (err) => {
				if (err) console.error(err);
			});
		}
		return message.channel.send('There is nothing playing in this server.');
	}

};
