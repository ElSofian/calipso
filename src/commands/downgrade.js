const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const roles = require("../config.js");

module.exports = {
    name: "downgrade",
    description: "Permet de rétrograder un employé.",
    admin: true,
    options: [
        {
            name: "employé",
            description: "L'employe à promouvoir",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "grade",
            description: "Le nouveau grade de l'employé",
            type: ApplicationCommandOptionType.String,
            choices: roles.grades.map(role => ({ name: role, value: role })),
            required: false
        }
    ],
    run: async(client, interaction, { successEmbed, errorEmbed }) => {
        
        await interaction.deferReply();

        const employee = interaction.options.getUser("employé");
        const grade = interaction.options.getString("grade");

        const employeeData = await client.db.getEmployee(employee.id);
        if (!employeeData) return errorEmbed("Cet employé n'est pas présent dans la base de données de l'entreprise.", false, "editReply");

        const currentGrade = employeeData.grade; // Vendeur Novice
        if (grade && currentGrade == grade) return errorEmbed(`Cet employé a déjà le grade **${currentGrade}**.`, false, "editReply");
        if (!grade && employeeData.grade == roles[roles.length - 1].value) return errorEmbed(`Vous ne pouvez pas rétrograder un ${roles[roles.length - 1].value}.`, false, "editReply");
        
        const currentRoleIndex = roles.findIndex(role => role.value === currentGrade);
        if (currentRoleIndex === -1) return errorEmbed("Le grade actuel de cet employé n'a pas été trouvé.", false, "editReply");

        const newRole = roles[currentRoleIndex + 1].value;
        
        /* Add roles ~ Cannot work in examples shows
        const currentRoleId = client.functions.getGradeRoleId(currentGrade);
        const newRoleId = client.functions.getGradeRoleId(grade ?? newRole);
        if (!newRoleId) return errorEmbed(`Je n'ai pas trouvé le rôle **${newRoleId}**.`, false, "editReply");

        const employeeMember = interaction.guild.members.cache.get(employee.id);
        if (!employeeMember) return errorEmbed("Cet employé n'est pas présent sur le serveur.", false, "editReply");
        
        employeeMember.roles.add(newRoleId).catch(e => console.error(e));
        employeeMember.roles.remove(currentRoleId).catch(e => console.error(e));
        */

        const data = {
            action: "downgradeEmployee",
            nom: employeeData.last_name,
            prenom: employeeData.first_name,
            grade: grade ?? newRole,
        }

        await client.db.setEmployee(employee.id, "grade", grade ?? newRole);
        await client.google.post(data);

        return successEmbed(`<@${employee.id}> a été rétrograder au grade **${grade ?? newRole}** !`, false, false, "editReply");
    }
}