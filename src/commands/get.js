const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "get",
    description: "Permet de voir un employé.",
    admin: true,
    options: [{
        name: "employé",
        description: "L'employé à voir.",
        type: ApplicationCommandOptionType.User,
        required: false
    }],
    run: async(client, interaction, { successEmbed, errorEmbed }) => {
        const employee = interaction.options.getUser("employé");
        if (!employee) {
            const employees = await client.db.getEmployees();
            console.log(employees);
            if (!employees.length) return errorEmbed("Aucun employé n'est enregistré.");
            return;
        }

        const employeeData = await client.db.getEmployee(employee.id);
        if (!employeeData) return errorEmbed("L'employé est introuvable.");

        console.log(employeeData);
        successEmbed("Employé trouvé.", true, "editReply");
    }
}