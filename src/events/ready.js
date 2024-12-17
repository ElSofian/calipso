const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	run: async(client) => {
		client.logger.info("Ready!");

		let activities = [
			{ name: `les demandes de support`, type: ActivityType.Watching },
			{ name: `Contactez-nous !`, type: ActivityType.Custom },
			{ name: `Prêt à vous simplifier la vie ?`, type: ActivityType.Custom },
			{ name: "vos besoins professionnels", type: ActivityType.Listening },
		]

		client.user.setActivity(activities[0].name, { type: activities[0].type });

		let i = 0;
		setInterval(() => {
			client.user.setActivity(activities[i].name, { type: activities[i].type });
			i = ++i % activities.length;
		}, 300000);

	}
};
