/* eslint-disable consistent-return */
/* eslint-disable max-len */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const config = require('../../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['message', 'msg'],
			description: 'DM\'s a specified user',
			category: 'Moderation',
			usage: `${config.prefix}dm <user>`
		});
	}
	async run(message, args) {
		if (!message.member.hasPermission('ADMINISTRATOR')) { return message.channel.send(new MessageEmbed().setDescription(`Sorry you are missing the permission \`ADMINISTRATOR\`.`)); }

		const user = message.mentions.users.first() || message.guild.member(args[0]);

		if (!user) { message.channel.send(new MessageEmbed().setDescription(`Please mention someone by mentioning them or using their ID.`)); }

		const text = args.slice(1).join(' ');

		if (!text) { return message.channel.send(new MessageEmbed().setDescription(`Please provide some text to send!`)); }

		user.send(text).catch(() => message.channel.send(new MessageEmbed().setDescription(`Sorry this user has their dms locked!`)));

		const embed = new MessageEmbed()
			.setColor('GREEN')
			.setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
			.setDescription(`Successfully sent a direct message to ${user}!`);

		return message.channel.send(embed);
	}

};
