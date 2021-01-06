/* eslint-disable id-length */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['new', 't'],
			description: 'Creates a ticket',
			category: 'Ticket Tools',
			usage: '<topic>'
		});
	}
	async run(message) {
		if (message.deletable) message.delete();
		const reason = message.content.split(' ').slice(1).join(' ');

		let SupportCategory = message.guild.channels.cache.find(category => category.name === 'Tickets');

		if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !SupportCategory) {
			SupportCategory = await message.guild.channels.create('Tickets', {
				type: 'category'
			});
		}

		if (!message.guild.me.hasPermission('MANAGE_CHANNELS') && !SupportCategory) {
			message.channel.send('Sorry, buy I do not have permisson to create the Support Category needed for tickets')
			.then(msg => {
				msg.delete({ timeout: 10000 })
			  })
			  .catch(console.error);
		}

		if (!message.guild.roles.cache.find(role => role.name === 'Support Team')) {
			message.guild.roles.create({
				data: {
					name: 'Support Team',
					color: 'BLUE'
				},
				reason: 'we needed a role for Super Cool People'
			});
			console.log('created a support team role!');
		}

		const supportrole = message.guild.roles.cache.find(role => role.name === 'Support Team');

		if (!supportrole) {
			return message.channel.send('Sorry, but there is no support team role in this server. \n Either create one or give me permission to create one')
			.then(msg => {
				msg.delete({ timeout: 5000 })
			  })
			  .catch(console.error);
		}

		if (!reason) {
			return message.channel.send(`Please provide a ticket subject. \n ${this.client.prefix}ticket {subject}`)
			.then(msg => {
				msg.delete({ timeout: 5000 })
			  })
			  .catch(console.error);
		}
		// eslint-disable-next-line no-useless-escape
		var specialChars = '!@#$^&%*()+=-[]\/{}|:<>?,.';

		const channelName = `ticket-${message.author.username}-${message.author.discriminator}`;
		if (message.guild.channels.cache.find(channel => channel.name === `ticket-${message.author.username.toLowerCase().replace(specialChars, '')}-${message.author.discriminator}`)) {
			return message.channel.send('Hey! You already have a ticket open!')
			.then(msg => {
				msg.delete({ timeout: 10000 })
			  })
			  .catch(console.error);
		}

		message.guild.channels.create(channelName, { parent: SupportCategory.id, topic: `Ticket Owner: ${message.author.tag}, ID: ${message.author.id}, reason for ticket: ${reason}` }).then(c => {
			const staff = message.guild.roles.cache.find(role => role.name === 'Support Team');
			const everyone = message.guild.roles.cache.find(role => role.name === '@everyone');
			c.updateOverwrite(staff, {
				SEND_MESSAGES: true,
				VIEW_CHANNEL: true
			});
			c.updateOverwrite(everyone, {
				SEND_MESSAGES: false,
				VIEW_CHANNEL: false
			});
			c.updateOverwrite(message.author, {
				SEND_MESSAGES: true,
				VIEW_CHANNEL: true
			});
			const Greeting = new MessageEmbed()
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 512 }))
			.setColor(message.author.displayHexColor || 'BLUE')
			.addField('New Support Ticket', `<@${message.author.id}> Thanks for submitting a ticket! Our staff will be with you shortly!`)
			.addField('Issue', reason)
			.setTimestamp()
			.setFooter(`Requested by ${message.author.tag}`);
			c.send(Greeting);
			const createdTicketEmbed = new MessageEmbed()
				.setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 512 }))
				.setColor(message.author.displayHexColor || 'BLUE')
				.setTitle('New Support Ticket')
				.setDescription(`<@${message.author.id}> your support ticket channel is <#${c.id}>`)
				.setTimestamp()
				.setFooter(`Requested by ${message.author.tag}`);
			message.channel.send(createdTicketEmbed)
			.then(msg => {
				msg.delete({ timeout: 10000 })
			  })
			  .catch(console.error);
		}).catch(console.error);
		// eslint-disable-next-line consistent-return
		return;
	}

};
