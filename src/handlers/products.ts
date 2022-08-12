import express, { Request, Response } from "express";
import { Product, ProductStore } from "../models/products";
import { verifyAuthMiddleWare } from "./orders";

const store = new ProductStore();

const productRoutes = (app: express.Application) => {
  app.get("/products", index);
  app.post("/products", verifyAuthMiddleWare, create);
  app.get("/products/:id", show);
  app.delete("/products/:id", verifyAuthMiddleWare, delete_);
};

const index = async (req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(401);
    res.json({ error: err });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const price = +req.body.price;
    const category = req.body.category;
    const createdProduct = await store.create(name, price, category);
    res.json(createdProduct);
  } catch (error) {
    console.log(error);
    res.status(401);
    res.json({ error: error });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await store.show(+productId);
    res.json(product);
  } catch (error) {
    res.status(401);
    res.json({ error: error });
  }
};

const delete_ = async (req: Request, res: Response) => {
  const id: number = +req.params.id;
  try {
    if (isNaN(id)) throw new Error("please provde proper id");
    const deletedProduct = await  store.delete(id);
    res.json(deletedProduct);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

export default productRoutes;
