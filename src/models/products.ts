import Client from "../database";

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM products";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`error fetching products ${err}`);
    }
  }

  async show(id: number) {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM products where id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`error showing product${err}`);
    }
  }

  async create(
    name: string,
    price: number,
    category: string
  ): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql =
        "INSERT INTO products (name,price,category) VALUES ($1,$2,$3) RETURNING *";
      const result = await conn.query(sql, [name, price, category]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`error creating product ${err}`);
    }
  }

  async delete(id: number): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = "DELETE FROM products WHERE id=($1) RETURNING *";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0]
    } catch (err) {
      throw new Error(`error deleting product ${err}`);
    }
  }
}
