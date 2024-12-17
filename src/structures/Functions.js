module.exports = class Functions {
    constructor(client) {
        this.client = client;
    }

    getGradeRoleId(grade) {
        let gradeRoleId;
        switch (grade) {
            case "Responsable": gradeRoleId = this.client.config.roles.responsable; break;
            case "Ressources Humaines": gradeRoleId = this.client.config.roles.humanRessources; break;
            case "Chef d'équipe Vendeur": gradeRoleId = this.client.config.roles.salesTeamChief; break;
            case "Chef d'équipe pompist": gradeRoleId = this.client.config.roles.pompistTeamChief; break;
            case "Vendeur Expérimenté": gradeRoleId = this.client.config.roles.salesExpert; break;
            case "Pompiste Expérimenté": gradeRoleId = this.client.config.roles.pompistExpert; break;
            case "Vendeur": gradeRoleId = this.client.config.roles.sales; break;
            case "Pompiste": gradeRoleId = this.client.config.roles.pompist; break;
            case "Vendeur Novice": gradeRoleId = this.client.config.roles.salesNovice; break;
            case "Pompiste Novice": gradeRoleId = this.client.config.roles.pompistNovice; break;
        }
        return gradeRoleId;
    }
    
    getSpecialityRoleId(speciality)  {
        let specialityRoleId;
        switch (speciality) {
            case "Livreur": specialityRoleId = this.client.config.roles.deliveryMan; break;
            case "Cuisinier": specialityRoleId = this.client.config.roles.cooker; break;
            case "Logistique": specialityRoleId = this.client.config.roles.logistics; break;
            case "Formateur": specialityRoleId = this.client.config.roles.trainer; break;
            case "Gestion des commandes": specialityRoleId = this.client.config.roles.orderManagment; break;
            case "Evenementiel": specialityRoleId = this.client.config.roles.events; break;
            case "Communication": specialityRoleId = this.client.config.roles.communication; break;
        }
        return specialityRoleId;
    }

    checkDate(date, dateCanBeInPast = false) {
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!date || !date.match(dateRegex)) return { valid: false, errorMsg: "La date doit être au format **JJ/MM/AAAA**." }
    
        const [day, month, year] = date.split("/").map(Number);
        if (month < 1 || month > 12) return {  valid: false, errorMsg: "Le mois doit être compris entre 1 et 12." }
    
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0))
            daysInMonth[1] = 29;
    
        if (day < 1 || day > daysInMonth[month - 1]) return {  valid: false, errorMsg: `Le jour doit être compris entre 1 et ${daysInMonth[month - 1]} pour le mois ${month}.` }
    
        const dateObject = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        if (!dateCanBeInPast && dateObject < today) return { valid: false, errorMsg: "La date ne peut pas être dans le passé." }
    
        return { valid: true, errorMsg: null }
    }
}