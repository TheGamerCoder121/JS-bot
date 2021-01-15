/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable no-empty */
/* eslint-disable no-mixed-spaces-and-tabs */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const config = require('../../../config.json');
const ms = require('parse-duration');

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
		if (!message.member.hasPermission('MUTE_MEMBERS')) { return message.channel.send(new MessageEmbed().setDescription(`You are missing permission \`MUTE_MEMBERS\``).setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }))); }
		const member = message.mentions.members.first() || message.guild.member(args[0]);
		const muterole = message.guild.roles.cache.get(config.Moderation.muted_role);
		const time = ms(args[1]);
		const mutereason = args.slice(time ? 2 : 1).join(' ') || 'No Reason Provided';
		const log = this.client.channels.cache.get(this.logchannel);

		if (!member) return message.channel.send(new MessageEmbed().setDescription('Please put a valid member or a user ID for me to mute').setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true })));
		if (!muterole) return message.channel.send(new MessageEmbed().setDescription('I cant find the mute role on the server!').setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true })));
		if (member.id === message.author.id) return message.channel.send(new MessageEmbed().setDescription('Stop being a dumbass... You can\'t mute yourself.').setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true })));
		if (member.user.bot) return message.channel.send(new MessageEmbed().setDescription('You can\'t mute a bot!').setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true })));
		if (member.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) return message.channel.send(new MessageEmbed().setDescription('You can only mute members that have a lower role than you.').setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true })));
		if (member.hasPermission('ADMINISTRATOR') || member.roles.highest.rawPosition >= message.guild.me.roles.highest.rawPosition) return message.channel.send(new MessageEmbed().setDescription('I cant mute that member').setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true })));
		if (member.roles.cache.has(muterole.id)) return message.channel.send(new MessageEmbed().setDescription('That member is already muted!').setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true })));

		this.client.members.ensure(message.guild.id, this.client.memberSettings, member.id);

		await member.roles.add(muterole);
		this.client.members.set(message.guild.id, { muted: true, mutedAt: time ? Date.now() + time : null }, `${member.id}.muted`);

		if (time) {
			setTimeout(() => {
				this.client.members.set(message.guild.id, { muted: false, mutedAt: null }, `${member.id}.muted`);
				// eslint-disable-next-line no-empty-function
				member.roles.remove(muterole).catch(() => {});
			}, time);
		}
		const casenum = this.client.settings.get(message.guild.id, 'cases').length + 1;
		const embed = new MessageEmbed()
			.setAuthor(`${message.author.tag} - (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`**Member:** ${member}\n**Action:** Mute\n**Reason:** ${mutereason}`)
			.setFooter(`Case ${casenum}`, message.guild.iconURL({ dynamic: true }))
			.setThumbnail(member.user.displayAvatarURL())
			.setColor(`YELLOW`);

		if (log) log.send(embed);
		await message.channel.send(embed);

		this.client.members.push(message.guild.id, embed, `${member.id}.punishments`);
		this.client.settings.push(message.guild.id, embed, 'cases');

		// eslint-disable-next-line no-empty-function
		const dm = await member.send(embed.setTitle('You have been muted!')).catch(() => {});
		if (!dm) message.channel.send(new MessageEmbed().setDescription(`Damn no getting them mad.. their dms are locked.`));
	}

};
