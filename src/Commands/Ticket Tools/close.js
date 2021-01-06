const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Closes the current ticket',
			category: 'Ticket Tools'
		});
	}

	async run(message) {
		const embed = new MessageEmbed()
			.setTitle('Ticket closed')
			.setDescription(`${message.author.tag}, I have closed this ticket! This channel will be deleted in 5 seconds`)
			.setThumbnail()
			.setFooter(`Closed by: ${message.author.tag}`)
			.setColor(message.author.displayHexColor || 'BLUE')
			.setThumbnail(message.guild.iconURL({ dynamic: true }));
		message.channel.send(embed);
		setTimeout(() => {
			message.channel.delete();
		}, 10000);
	}

};
