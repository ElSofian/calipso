const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "embed",
    description: "Crée un embed.",
    admin: true,
    options: [
        {
            name: "color",
            description: "Color of the embed.",
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: "title",
            description: "Title of the embed.",
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: "description",
            description: "Description of the embed.",
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: "footer",
            description: "Footer of the embed.",
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: "timestamp",
            description: "Timestamp of the embed.",
            type: ApplicationCommandOptionType.Boolean,
            required: false
        },
        {
            name: "thumbnail",
            description: "Thumbnail of the embed.",
            type: ApplicationCommandOptionType.Attachment,
            required: false
        },
        {
            name: "image",
            description: "Image of the embed.",
            type: ApplicationCommandOptionType.Attachment,
            required: false
        }
    ],
    run: async(client, interaction, { errorEmbed }) => {
        const color = interaction.options.getString("color");
        const title = interaction.options.getString("title");
        const description = interaction.options.getString("description");
        const footer = interaction.options.getString("footer");
        const timestamp = interaction.options.getBoolean("timestamp");
        const thumbnail = interaction.options.getAttachment("thumbnail");
        const image = interaction.options.getAttachment("image");

        if (!description) return errorEmbed("You must provide a description.");

        const embed = new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setDescription(description)

        if (color) embed.setColor(color);
        if (title) embed.setTitle(title);
        if (footer) embed.setFooter({ text: footer });
        if (timestamp) embed.setTimestamp();
        if (thumbnail) embed.setThumbnail(thumbnail.url)
        if (image) embed.setImage(image.url);

        interaction.reply({ embeds: [embed] });
    }
}