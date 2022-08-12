import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const {
  POSTGRES_USER,
  POSTGRES_DB_TEST,
  POSTGRES_DB_DEV,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  ENV,
} = process.env;


// let Client: Pool;

// if (ENV === "DEV") {
  // Client = new Pool({
  //   host: POSTGRES_HOST,
  //   database: POSTGRES_DB_DEV,
  //   user: POSTGRES_USER,
  //   password: POSTGRES_PASSWORD,
  // });
// } else {
  const Client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
// }

export default Client;
