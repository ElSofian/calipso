module.exports = class Database {
    constructor(client) {
        this.client = client;
    }

    // Database

    async init() {
        await this.client.db.set("employees", []);
    }


    // Employees

    async getEmployee(userId) {
        const employee = await this.client.db.get(`employees.${userId}`);
        return employee || null;
    }

    async getEmployeeName(userId, returnType = "string") {
        const row = await this.getEmployee(userId);
        if (!row) return null;

        switch(returnType) {
            case "array": return [row.first_name, row.last_name];
            case "object": return { first_name: row.first_name, last_name: row.last_name };
            case "string":
            default: return `${row.first_name} ${row.last_name}`;
        }
    }

    async createEmployee(userId, firstName, lastName, birthDate, grade, speciality, phone, iban) {        
        await this.client.db.push(`employees.${userId}`, { user_id: userId, first_name: firstName, last_name: lastName, birth_date: birthDate, grade, specialities: [speciality], phone, iban });
    }

    async addSpeciality(employeeId, speciality) {
        await this.client.db.push(`employees.${employeeId}.specialities`, speciality);
    }

    async setEmployee(userId, key, value) {
        await this.client.db.set(`employees.${userId}.${key}`, value);
    }

    async deleteEmployee(userId) {
        await this.client.db.delete(`employees.${userId}`);
    }

}