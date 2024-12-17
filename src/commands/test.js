const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "test",
    description: "Commande test",
    admin: true,
    run: async(client, interaction, { errorEmbed }) => {
        console.log("ok");
    }
}