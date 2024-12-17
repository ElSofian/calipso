const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "recrutement",
    description: "Affiche les informations de recrutement",
    run: async(client, interaction, { errorEmbed }) => {
        const embed = new EmbedBuilder()
        .setColor(client.config.embed.color)
        .setTitle("Informations recrutement")
        .setDescription(`L'entreprise Calipso est une entreprise Anglais basée sur Londres et n'a pas encore de balise sur Los Santos.
            De ce fait, nous ne recrutons pas !`)

        interaction.reply({ embeds: [embed] });
    }
}