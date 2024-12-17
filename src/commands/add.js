const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "add",
    description: "Permet d'ajouter une spécialité à un employé.",
    admin: true,
    options: [{
        name: "spécialité",
        description: "La spécialité à ajouter",
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: "employé",
            description: "L'employé à qui ajouter la spécialité",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "spécialité",
            description: "La spécialité à ajouter",
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "Formateur", value: "Formateur" },
                { name: "Evenementiel", value: "Evenementiel" },
                { name: "Communication", value: "Communication" },
            ],
            required: true
        }]
    }],
    run: async(client, interaction, { successEmbed, errorEmbed }) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand == "spécialité") {
            const employee = interaction.options.getUser("employé");
            const speciality = interaction.options.getString("spécialité");

            if (!employee) return errorEmbed("L'employé est introuvable.");
            if (!speciality) return errorEmbed("La spécialité est introuvable.");

            const employeeData = await client.db.getEmployee(employee.id);
            if (!employeeData) return errorEmbed("L'employé est introuvable.");

            if (employeeData.specialities.includes(speciality)) return errorEmbed("Cet employé a déjà cette spécialité.");

            const data = {
                action: "addSpeciality",
                nom: employeeData.last_name,
                prenom: employeeData.first_name,
                specialite: speciality
            }

            await client.google.post(data);
            await client.db.addSpeciality(employeeData.id, speciality);

            successEmbed(`La spécialité **${speciality}** a bien été ajoutée à ${employee} !`);
        }
    }
}