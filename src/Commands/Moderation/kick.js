/* eslint-disable no-empty */
/* eslint-disable no-mixed-spaces-and-tabs */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['b'],
			category: 'Moderation',
			usage: '<user> <reason>'
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		const { member } = message;
		// eslint-disable-next-line id-length
		const logchannel = message.guild.channels.cache.find(c => c.name === this.logchannel) || message.channel;

		const tag = `<@${member.id}>`;

		const reason = args.slice(2).join(' ');

		if (message.deletable) message.delete();

		if (member.hasPermission('ADMINISTRATOR') || member.hasPermission('KICK_MEMBERS')) {
			const target = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
			console.log(target);
			if (target) {
				const targetMember = message.guild.members.cache.get(target.id);
				targetMember.kick();
				message.channel.send(`${tag} has kicked ${target.tag} for ${reason}`);
				const embed = new MessageEmbed()
					.setColor('RED')
					.setThumbnail(target.user.displayAvatorURL({ dynamic: true }))
					.setDescription(`${message.author.tag} has kicked ${member.tag} for ${args[1]}`)
					.setTimestamp();

				logchannel.send(embed);
			} else {
				message.channel.send(`${tag} Please specify someone to kick!`);
			}
		} else {
			message.channel.send(`${tag} You do not have permission to kick members`);
		}
	}

};
