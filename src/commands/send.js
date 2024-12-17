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
                
                embed.setTitle("Assistant Calipso")
                .setDescription(`Bienvenue sur le serveur de support de Calipso !
                    
                Si vous avez une question ou un problème, n'hésitez pas à nous contacter en appuyant sur le bouton ci-dessous.
                Notre **CEO** se fera un plaisir de vous recevoir !`)

                components.addComponents(row);
                break;
            }
            
            case "absence": {

                const row = new ButtonBuilder()
                .setCustomId("absence")
                .setStyle(ButtonStyle.Success) 
                .setLabel("Déclarer une absence")
                .setEmoji("💌")

                embed.setTitle("Absences")
                .setDescription(`Pour déclarer une absence, rien de plus simple, il suffit d'appuyer sur le bouton ci-dessous et de renseigner les informations suivantes :\n**- La date de fin de votre absence\n- La raison de votre absence**`)

                components.addComponents(row);
                break;
            }
            case "edit": {

                components.addComponents(
                    new ButtonBuilder().setCustomId("phone").setStyle(ButtonStyle.Secondary).setLabel("Numéro de Téléphone").setEmoji("📞"),
                    new ButtonBuilder().setCustomId("iban").setStyle(ButtonStyle.Secondary).setLabel("IBAN").setEmoji("💳"),
                )

                embed.setTitle("Modification d'informations")
                .setDescription(`Afin de simplifier la vie de tout le monde, vous pouvez vous-mêmes modifier votre numéro de téléphone et votre IBAN en totale autonomie.
                    
                    Ces informations seront donc mise à jour automatiquement dans la base de données ainsi que la comptabilité.`)
                
                break;
            }
            default:
                return await interaction.reply({ embeds: [errorEmbed.setDescription("L'embed spécifié n'existe pas.")] });
        }

        const message = await interaction.channel.send({ embeds: [embed], components: components.components.length ? [components] : [] });
        successEmbed(`Voici l'ID du message à mettre dans le fichier config: **${message.id}**`, false, true);

    }
}