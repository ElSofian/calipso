const { QuickDB } = require('quick.db');

module.exports = class Database {
    constructor(client) {
        this.client = client;
        this.db = new QuickDB();
    }

    // Database

    async init() {
        await this.db.set("employees", []);
    }

    // Employees

    async getEmployee(userId) {
        const employee = await this.db.get(`employees.${userId}`);
        return employee || null;
    }

    async getEmployeeName(userId, returnType = "string") {
        const row = await this.getEmployee(userId);
        if (!row) return null;

        switch (returnType) {
            case "array": return [row.first_name, row.last_name];
            case "object": return { first_name: row.first_name, last_name: row.last_name };
            case "string":
            default: return `${row.first_name} ${row.last_name}`;
        }
    }

    async createEmployee(userId, firstName, lastName, birthDate, grade, speciality, phone, iban) {
        await this.db.push(`employees.${userId}`, { 
            user_id: userId, 
            first_name: firstName, 
            last_name: lastName, 
            birth_date: birthDate, 
            grade, 
            specialities: [speciality], 
            phone, 
            iban 
        });
    }

    async addSpeciality(employeeId, speciality) {
        await this.db.push(`employees.${employeeId}.specialities`, speciality);
    }

    async setEmployee(userId, key, value) {
        await this.db.set(`employees.${userId}.${key}`, value);
    }

    async deleteEmployee(userId) {
        await this.db.delete(`employees.${userId}`);
    }
}
