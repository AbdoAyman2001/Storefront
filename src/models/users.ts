import Client from "../database";
import bcrypt from "bcrypt";

const pepper = process.env.PEPPER;
const salt = process.env.SALT_ROUNDS;

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  password?: string;
};

export class UserStore {
  async show(id: number): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM users WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`error showing user ${err}`);
    }
  }

  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM users";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`error indexing users${err}`);
    }
  }

  async create(
    firstname: string,
    lastname: string,
    password: string
  ): Promise<User> {
    const hashedPassword = bcrypt.hashSync(password + pepper, parseInt(salt!));
    const conn = await Client.connect();
    try {
      const sql =
        "INSERT INTO users (firstName,lastName,password) VALUES ($1,$2,$3) RETURNING *";

      const result = await conn.query(sql, [
        firstname,
        lastname,
        hashedPassword,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      console.log(err);
      throw new Error(`cannot create new user ${err}`);
    }
  }

  async authenticate(
    firstName: string,
    lastName: string,
    password: string
  ): Promise<null | User> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM users WHERE firstName=($1) AND lastName=($2)";
      const result = await conn.query(sql, [firstName, lastName]);
      conn.release();
      if (result.rows.length) {
        const user: User = result.rows[0];
        if (bcrypt.compareSync(password + pepper, user.password!)) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(`cannot authenticate user ${err}`);
    }
  }

  async delete(id:number):Promise<User>{
    try {
      const conn= await Client.connect()
      const sql = "DELETE FROM users WHERE id=($1) RETURNING *"
      const result = await conn.query(sql,[id])
      conn.release();
      return result.rows[0]      
    } catch (error) {
      throw new Error(`cannot delete uesr ${error}`);
    }
  }  
}
