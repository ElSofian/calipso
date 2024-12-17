const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	run: async(client) => {
		client.logger.info("Ready!");

		let activities = [
			{ name: `Optimise votre temps de 400%`, type: ActivityType.Custom },
			{ name: `les comptabilité optimisées`, type: ActivityType.Watching },
			{ name: `Prenez rdv maintenant !`, type: ActivityType.Custom }
		]

		client.user.setActivity(activities[0].name, { type: activities[0].type });

		let i = 0;
		setInterval(() => {
			client.user.setActivity(activities[i].name, { type: activities[i].type });
			i = ++i % activities.length;
		}, 300000);

	}
};
