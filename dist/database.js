"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { POSTGRES_USER, POSTGRES_DB_TEST, POSTGRES_DB_DEV, POSTGRES_HOST, POSTGRES_PASSWORD, ENV, } = process.env;
// let Client: Pool;
// if (ENV === "DEV") {
// Client = new Pool({
//   host: POSTGRES_HOST,
//   database: POSTGRES_DB_DEV,
//   user: POSTGRES_USER,
//   password: POSTGRES_PASSWORD,
// });
// } else {
const Client = new pg_1.Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
});
// }
exports.default = Client;
