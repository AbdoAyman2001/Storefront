import Client from "../database";
import { Product } from "./products";
import { User } from "./users";

export type Order = {
  id: number;
  status: "active" | "complete";
  user_id: number;
};

export type OrderProduct = {
  id:number;
  order_id:number;
  product_id : number;
  quantity : number;
}


export class OrderStore {
  // fetching all orders for the logged in user
  async index(user_id: number): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM orders WHERE user_id=($1)";
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`error fetching user orders ${err}`);
    }
  }

  async create(
    user_id: number,
    status: string
  ): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql =
        "INSERT INTO orders (status,user_id) VALUES ($1,$2) RETURNING *";
      const result = await conn.query(sql, [status, user_id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`error creating Order ${err}`);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM orders WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`error creating Order ${err}`);
    }
  }

  async addProduct(
    product_id: number,
    quantity: number,
    order_id: number
  ): Promise<OrderProduct> {
    try {
      const conn = await Client.connect();
      const sql =
        "INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *";
      const result = await conn.query(sql, [quantity, order_id, product_id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not add product ${product_id} to order ${order_id}: ${err}`
      );
    }
  }


  // fetching all complete orders for logged in user
  async completedOrders(user_id: number): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM orders WHERE user_id=($1) AND status=($2)";
      const result = await conn.query(sql, [user_id, "complete"]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`error fetching completedorders ${err}`);
    }
  }


  async indexProducts(order_id: number) {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * from order_products WHERE order_id=($1)";
      // const sql = "SELECT * FROM order_products"
      const result = await conn.query(sql ,[order_id]);
      conn.release();
      return result.rows;
    } catch (err) {
      console.log("model err : ",err);
      throw new Error(`cannot index order products ${err}`);
    }
  }
}
