const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

module.exports = {
    name: "send",
    description: "Envoie l'embed voulu.",
    options: [{
        name: "embed",
        description: "L'embed à envoyer",
        type: ApplicationCommandOptionType.String,
        choices: [
            { name: "Pompes", value: "pumps" },
            { name: "Prix Essence", value: "gaz_price" },
            { name: "Absences", value: "absence" },
            { name: "Modification d'informations pour employés", value: "edit" }
        ],
    }],
    admin: true,
    run: async(client, interaction, { successEmbed, errorEmbed }) => {
        const embedType = interaction.options.getString("embed");
        
        const embed = new EmbedBuilder()
        .setColor(client.config.colors.default)

        const components = new ActionRowBuilder()
        const pumps = await client.db.getPumps();
        
        switch(embedType) {
            case "pumps": {

                const sm = new StringSelectMenuBuilder()
                .setCustomId("sm")
                .setPlaceholder("Choisissez la pompe que vous voulez éditer")

                embed
                .setThumbnail("https://imgur.com/TRDDKOW.png")
                .setImage("https://imgur.com/9PZ1WQb.png")
                .setTitle("Pompes")
                for (const pump of pumps) {
                    embed.addFields([{ name: pump.label, value: `» ${pump.fuel} litres` }]);
                    sm.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(`${pump.label}${pump.fuel < pump.alertAmount ? " 🚨" : ""}`)
                            .setValue(pump.label)
                    );
                }
                components.addComponents(sm);
                break;
            }
            case "gaz_price": {

                embed
                .setThumbnail("https://imgur.com/TRDDKOW.png")
                .setImage("https://imgur.com/9PZ1WQb.png")
                .setTitle("Prix des Pompes")
                for (const pump of pumps)
                    embed.addFields([{ name: pump.label, value: `» ${pump.price}$/L`, inline: true }]);
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