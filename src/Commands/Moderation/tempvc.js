/* eslint-disable id-length */
/* eslint-disable max-len */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const config = require('../../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['vc'],
			category: 'Moderation',
			usage: '<user> <reason>'
		});
	}

	async run(message, args) {
		// eslint-disable-next-line consistent-return
		const vcSettings = config.tempvc;
		if (!message.member.hasPermission('ADMINISTRATOR')) { return message.channel.send(new MessageEmbed().setDescription(`You are missing permission \`ADMINISTRATOR\``).setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }))); }
		if (!vcSettings.Allowed_Roles.some(s => message.member.roles.cache.has(s))) return message.channel.send(new MessageEmbed().setDescription('Sorry, but you cant create a temp vc!').setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true })));
		if (!args[0]) return message.channel.send(new MessageEmbed().setDescription('You need to enter what you want the name of the vc to be!').setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true })));

		const vc = await message.guild.channels.create(args.join(' '), {
			type: 'voice',
			permissionOverwrites: [{ id: message.author, allow: ['CONNECT'] }, { id: message.guild.id, deny: ['CONNECT'] }]
		});
		const under = this.client.channels.cache.get(vcSettings.Create_VCS_Under);
		await vc.setParent(vcSettings.Temp_VC_Category);
		if (under && under.parentID === vc.Temp_VC_Category) await vc.setPosition(under.rawPosition + 1);

		// this.client.settings.set(message.guild.id, { user: message.author.id }, `vc.${vc.id}`);
		await message.channel.send(new MessageEmbed().setDescription(`Successfully created a temporary vc named ${args.join(' ')}`).setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true })));
		return message.channel.send((await vc.createInvite()).url);
	}

};
