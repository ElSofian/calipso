const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "recrutement",
    description: "Affiche les informations de recrutement",
    run: async(client, interaction, { errorEmbed }) => {
        const embed = new EmbedBuilder()
        .setColor(client.config.embed.color)
        .setTitle("Informations recrutement")
        .setDescription(`Les recrutements se passent lors des sessions de recrutement organisés par la Direction.
            
        Lorsqu'une session est organisée, elle sera indiquée dans <#${client.config.channels.recrutmentId}> !`)

        interaction.reply({ embeds: [embed] });
    }
}