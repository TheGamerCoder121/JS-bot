/* eslint-disable no-mixed-spaces-and-tabs */
const Command = require('../../Structures/Command');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { jsPDF } = require('jspdf');
const config = require('../../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ls', 'form'],
			description: 'Displays prompt to fill out a form',
			category: 'Ticket Tools'
		});
	}

	async run(message) {
		const embed = new MessageEmbed()
			.setColor('BLUE')
			.setAuthor(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
			.setThumbnail(this.client.user.displayAvatarURL())
			.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription([
				`Would you like to continue digitally signing the Product License?\n`,
				`You will be asked for your legal first and last name along with your email.\n`,
				`By signing this license you are stating if any bullet point in the TOS is broken, you will face legal action.\n`
			])
			.setTimestamp();
		message.channel.send(embed).then((question) => {
			// Have our bot guide the user by reacting with the correct reactions
			question.react('👍');
			question.react('👎');

			// Set a filter to ONLY grab those reactions & discard the reactions from the bot
			const filter = (reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && !user.bot;

			// Create the collector
			const collector = question.createReactionCollector(filter, {
				max: 1,
				time: 15000
			});

			collector.on('end', (collected, reason) => {
				if (reason === 'time') {
					message.reply('Ran out of time ☹...');
				} else {
					// Grab the first reaction in the array
					const userReaction = collected.array()[0];
					// Grab the name of the reaction (which is the emoji itself)
					const emoji = userReaction._emoji.name;

					// Handle accordingly
					if (emoji === '👍') {
						// Create an empty 'survey' object to hold the fields for our survey
						const survey = {};
						// We're going to use this as an index for the reactions being used.

						// Send a message to the channel to start gathering the required info
						message.channel
						  .send(
								'Please Enter your name (This must be your legal first and last name)'
						  )
						  .then(() => {
							// After each question, we setup a collector just like we did previously
								const filter1 = (msg) => !msg.author.bot;
								const options = {
							  max: 1,
							  time: 15000
								};

								return message.channel.awaitMessages(filter1, options);
						  })
						  .then((collected1) => {
							// Lets take the input from the user and store it in our 'survey' object
								survey.name = collected1.array()[0].content;
								// Ask the next question
								return message.channel.send(
							  'Enter the item(s) (These being the products you are intrested in purchasing)'
								);
						  })
						  .then(() => {
								const filter2 = (msg) => !msg.author.bot;
								const options = {
							  max: 1,
							  time: 15000
								};

								return message.channel.awaitMessages(filter2, options);
						  })
						  .then((collected2) => {
							// Lets take the input from the user and store it in our 'survey' object
								survey.items = collected2.array()[0].content;
								// Ask the next question
								return message.channel.send(
							  'Enter your paypal email (This being the email assigned to your paypal)'
								);
						  })
						  .then(() => {
								const filter3 = (msg) => !msg.author.bot;
								const options = {
							  max: 1,
							  time: 15000
								};

								return message.channel.awaitMessages(filter3, options);
						  })
						  .then((collected3) => {
							// Split the answers by commas so we have an array to work with
								survey.email = collected3.array()[0].content;
								console.log(survey);
								const today = new Date().toLocaleDateString();
								// Smessage.channel.send(survey);
								// eslint-disable-next-line new-cap
								const doc = new jsPDF();
								doc.text(`Created on ${today}`, 150, 10);
								doc.setFontSize(25);
								doc.text(`Legal Name: ${survey.name}`, 50, 70, 'center');
								doc.text(`Item(s): ${survey.items}`, 10, 85, 'left');
								doc.text(`Email: ${survey.email}`, 150, 70, 'center');
								doc.addImage(config.logodata, 'JPEG', 15, 20, 35, 35);
								doc.setFontSize(40);
								doc.text(`${message.guild.name}`, 120, 40, 'center');
								doc.setLineWidth(1);
								doc.line(10, 100, 200, 100);
								// will save the file in the current working directory
								doc.save('data/test.pdf');
								const attachment = new MessageAttachment('data/test.pdf');
								message.channel.send(`Here is your generated agreement ${message.author},`, attachment);
						  });
					} else if (emoji === '👎') {
						message.reply(`If you do not agree to these terms, you will not be allowed to purchase from ${message.guild.name}`);
					} else {
						// This should be filtered out, but handle it just in case
						message.reply(`I dont understand ${emoji}...`);
					}
				}
			});
			return;
		});
	}

};
