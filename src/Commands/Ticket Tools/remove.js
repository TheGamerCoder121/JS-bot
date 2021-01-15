/* eslint-disable max-len */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['rm'],
			description: 'Removes a user from a ticket',
			category: 'Ticket Tools'
		});
	}
	async run(message) {
		// eslint-disable-next-line no-useless-escape
		const specialChars = '!@#$^&%*()+=-[]\/{}|:<>?,.';
		const ticket = `ticket-${message.author.username.toLowerCase().replace(specialChars, '')};`;


		if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send(new MessageEmbed().setDescription('You are missing the permission `Manage Channels`').setFooter(`${message.guild.name} `, message.guild.iconURL({ dynamic: true })));
		if (!ticket) return message.channel.send(new MessageEmbed().setDescription('This command can only be used inside of tickets.').setFooter(`${message.guild.name} `, message.guild.iconURL({ dynamic: true })));
		if (!message.mentions.users.first()) return message.channel.send(new MessageEmbed().setDescription('Please mention a member to remove to this ticket.').setFooter(`${message.guild.name} `, message.guild.iconURL({ dynamic: true })));
		if (!message.channel.permissionOverwrites.has(message.mentions.users.first().id)) return message.channel.send(new MessageEmbed().setDescription('That user isnt in this ticket.').setFooter(`${message.guild.name} `, message.guild.iconURL({ dynamic: true })));

		message.channel.permissionOverwrites.get(message.mentions.users.first().id).delete();
		return message.channel.send(new MessageEmbed().setDescription(`${message.mentions.users.first()} has been removed to the ticket!`).setFooter(`${message.guild.name} `, message.guild.iconURL({ dynamic: true })));
	}

};
