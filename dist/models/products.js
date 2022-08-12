"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
const database_1 = __importDefault(require("../database"));
class ProductStore {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM products";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`error fetching products ${err}`);
        }
    }
    async show(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM products where id=($1)";
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`error showing product${err}`);
        }
    }
    async create(name, price, category) {
        try {
            const conn = await database_1.default.connect();
            const sql = "INSERT INTO products (name,price,category) VALUES ($1,$2,$3) RETURNING *";
            const result = await conn.query(sql, [name, price, category]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`error creating product ${err}`);
        }
    }
    async delete(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = "DELETE FROM products WHERE id=($1) RETURNING *";
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`error deleting product ${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
