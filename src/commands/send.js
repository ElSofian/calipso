const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

module.exports = {
    name: "send",
    description: "Envoie l'embed voulu.",
    options: [{
        name: "embed",
        description: "L'embed à envoyer",
        type: ApplicationCommandOptionType.String,
        choices: [
            { name: "Ticket", value: "ticket" },
            { name: "Absences", value: "absence" },
            { name: "Modification d'informations pour employés", value: "edit" }
        ],
    }],
    admin: true,
    run: async(client, interaction, { successEmbed, errorEmbed }) => {
        const embedType = interaction.options.getString("embed");
        
        const embed = new EmbedBuilder()
        .setColor(client.config.embed.color)

        const components = new ActionRowBuilder()
        
        switch(embedType) {
            case "ticket": {
                const row = new ButtonBuilder()
                .setCustomId("ticket")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Contactez-nous")
                .setEmoji("📩")
                
                embed.setAuthor({ name: "Hérmès ~ Assistant Calipso", iconURL: client.user.displayAvatarURL() })
                .setDescription(`Bienvenue sur le serveur de support de Calipso !
                    
                Si vous avez une question ou un problème, n'hésitez pas à nous contacter en appuyant sur le bouton ci-dessous.
                Notre **CEO** se fera un plaisir de vous recevoir !`)

                components.addComponents(row);
                break;
            }

            default:
                return errorEmbed("L'embed spécifié n'existe pas.");
        }

        const message = await interaction.channel.send({ embeds: [embed], components: components.components.length ? [components] : [] });
        successEmbed(`Voici l'ID du message à mettre dans le fichier config: **${message.id}**`, false, true);

    }
}