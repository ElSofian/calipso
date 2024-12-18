const { createPool } = require("mysql");

module.exports = class Database {
    constructor(client) {
        this.client = client;
        this.pool = createPool({ ...client.config.database, supportBigNumbers: true, bigNumberStrings: false });

        this._queryOne("SELECT 1+1;")
            .then(() => this.client.logger.db("Database connected"))
            .catch((error) => this.client.logger.error("Database connect error"));
    }

    async _queryOne(sql, values) {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, values, (error, results) => {
                if (error) {
                    this.client.logger.error(sql)
                    this.client.logger.error(`> ${error.sqlMessage}\n──────── 📛 FULL ERROR 📛 ────────`, "DATABASE QUERYONE ERROR");
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    }

    async _query(sql, values) {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, values, (error, results) => {
                if (error) {
                    this.client.logger.error(sql)
                    this.client.logger.error(`> ${error.sqlMessage}\n──────── 📛 FULL ERROR 📛 ────────`, "DATABASE QUERY ERROR");
                    return reject(error);
                }
                resolve(results);
            });
        });
    }


    // Employees

    async getEmployees() {
        const rows = await this._query(`
            SELECT e.id, e.first_name, e.last_name, e.birth_date, e.grade, e.phone, e.iban, s.name AS speciality
            FROM employees e
            LEFT JOIN employees_specialities es ON e.id = es.employee_id
            LEFT JOIN specialities s ON es.speciality = s.name
        `);
    
        const employees = [];
        const employeeMap = new Map();
    
        for (const row of rows) {
            if (!employeeMap.has(row.id)) {
                employeeMap.set(row.id, {
                    id: row.id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    birth_date: row.birth_date,
                    grade: row.grade,
                    phone: row.phone,
                    iban: row.iban,
                    specialities: row.speciality ? [row.speciality] : []
                });
                employees.push(employeeMap.get(row.id));
            } else if (row.speciality) {
                employeeMap.get(row.id).specialities.push(row.speciality);
            }
        }
    
        return employees;
    }

    async getEmployee(userId, returnType = "object") {
        const rows = await this._query(`
            SELECT e.id, e.first_name, e.last_name, e.birth_date, e.grade, e.phone, e.iban, s.name AS speciality
            FROM employees e
            LEFT JOIN employees_specialities es ON e.id = es.employee_id
            LEFT JOIN specialities s ON es.speciality = s.name
            WHERE e.user_id = ?
        `, [userId]);
    
        if (rows.length === 0) return null;
        rows[0].specialities = rows.map(row => row.speciality).filter(Boolean);

        return rows[0];
    }
    

    async getEmployeeName(userId, returnType = "string") {
        const row = await this._queryOne("SELECT first_name, last_name FROM employees WHERE user_id = ?", [userId]);
        if (!row) return null;

        switch(returnType) {
            case "object": return row;
            case "array": return [row.first_name, row.last_name];
            default: return `${row.first_name} ${row.last_name}`;
        }
    }

    async createEmployee(userId, firstName, lastName, birthDate, grade, speciality, phone, iban) {
        if (!speciality) speciality = "nothing";
        const query = await this._query("INSERT INTO employees (user_id, first_name, last_name, birth_date, grade, phone, iban) VALUES (?, ?, ?, ?, ?, ?, ?)", [userId, firstName, lastName, birthDate, grade, phone, iban]);
        return this._query("INSERT INTO employees_specialities (employee_id, speciality) VALUES (?, ?)", [query.insertId, speciality]);
    }

    async addSpeciality(employeeId, speciality) {
        return this._query("INSERT INTO employees_specialities (employee_id, speciality) VALUES (?, ?)", [employeeId, speciality]);
    }

    async removeSpeciality(employeeId, speciality) {
        return this._query("DELETE FROM employees_specialities WHERE employee_id = ? AND speciality = ?", [employeeId, speciality]);
    }

    async setEmployee(userId, key, value) {
        return this._query(`UPDATE employees SET \`${key}\` = ? WHERE user_id = ?`, [value, userId]);
    }

    async deleteEmployee(userId) {
        return this._query("DELETE FROM employees WHERE user_id = ?", [userId]);
    }
}