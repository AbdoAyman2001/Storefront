"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const pepper = process.env.PEPPER;
const salt = process.env.SALT_ROUNDS;
class UserStore {
    async show(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM users WHERE id=($1)";
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`error showing user ${err}`);
        }
    }
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM users";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`error indexing users${err}`);
        }
    }
    async create(firstname, lastname, password) {
        const hashedPassword = bcrypt_1.default.hashSync(password + pepper, parseInt(salt));
        const conn = await database_1.default.connect();
        try {
            const sql = "INSERT INTO users (firstName,lastName,password) VALUES ($1,$2,$3) RETURNING *";
            const result = await conn.query(sql, [
                firstname,
                lastname,
                hashedPassword,
            ]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            console.log(err);
            throw new Error(`cannot create new user ${err}`);
        }
    }
    async authenticate(firstName, lastName, password) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM users WHERE firstName=($1) AND lastName=($2)";
            const result = await conn.query(sql, [firstName, lastName]);
            conn.release();
            if (result.rows.length) {
                const user = result.rows[0];
                if (bcrypt_1.default.compareSync(password + pepper, user.password)) {
                    return user;
                }
            }
            return null;
        }
        catch (err) {
            throw new Error(`cannot authenticate user ${err}`);
        }
    }
    async delete(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = "DELETE FROM users WHERE id=($1) RETURNING *";
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`cannot delete uesr ${error}`);
        }
    }
}
exports.UserStore = UserStore;
