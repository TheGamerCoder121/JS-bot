/* eslint-disable no-empty */
/* eslint-disable no-mixed-spaces-and-tabs */
const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');

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

		const reason = args[2];

		if (message.deletable) message.delete();

		if (member.hasPermission('ADMINISTRATOR') || member.hasPermission('BAN_MEMBERS')) {
			const target = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
			console.log(target);
			if (target) {
				const targetMember = message.guild.members.cache.get(target.id);
				targetMember.ban();
				message.channel.send(`${tag} has banned ${target.tag} for ${reason}`);
				const embed = new MessageEmbed()
					.setColor(message.author.displayHexColor())
					.setThumbnail(member.user.displayAvatorURL({ dynamic: true }))
					.setDescription(`${message.author.tag} has banned ${member.tag} for ${args[1]}`)
					.setTimestamp();

				logchannel.send(embed);
			} else {
				message.channel.send(`${tag} Please specify someone to ban!`);
			}
		} else {
			message.channel.send(`${tag} You do not have permission to ban members`);
		}
	}

};
