const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ActivityType } = require('discord.js');

function formatDelay(delay) {
    const seconds = Math.floor((delay / 1000) % 60);
    const minutes = Math.floor((delay / (1000 * 60)) % 60);
    const hours = Math.floor(delay / (1000 * 60 * 60));
    return `${hours}h${minutes}min${seconds}s`;
}

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

		let i = Math.floor(Math.random() * activities.length);
		client.user.setActivity(activities[i].name, { type: activities[i].type });
		setInterval(() => {
			client.user.setActivity(activities[i].name, { type: activities[i].type });
			i = ++i % activities.length;
		}, 300000);

	}
};
