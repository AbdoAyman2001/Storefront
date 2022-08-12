import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OrderStore } from "../models/orders";
import { User } from "../models/users";

const store = new OrderStore();

export const verifyAuthMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token!, process.env.SECRET_KEY!);
    next();
  } catch (err) {    
    res.status(401);
    res.json({ error: err });
  }
};

const orderRoutes = (app: express.Application) => {
  app.get("/orders/:userId", verifyAuthMiddleWare, index);
  app.post("/orders/:userId", verifyAuthMiddleWare, create);
  app.get("/order/:orderId", verifyAuthMiddleWare, show);

  app.post("/orders/:orderId/products", verifyAuthMiddleWare, addProduct);
  app.get("/orders/:orderId/products",  indexProducts);
  
  app.get(
    "/completed-orders/:userId",
    verifyAuthMiddleWare,
    indexCompletedOrders
  );
};

const index = async (req: Request, res: Response) => {
  try {
    let userId: number = +req.params.userId;
    if (isNaN(userId)) {
      // if failed to fetch user id from paramaters we will use the token to get the user id.
      const token = req.headers.authorization?.split(" ")[1];
      const decoded: User = jwt.verify(token!, process.env.SECRET_KEY!) as User;
      userId = decoded.id;
    }
    const Products = await store.index(+userId);
    res.json(Products);
  } catch (error) {
    res.status(401);
    res.json({ error: error });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    let userId = +req.params.uesrId;
    if (isNaN(userId)) {
      const token = req.headers.authorization?.split(" ")[1];
      userId = (jwt.verify(token!, process.env.SECRET_KEY!) as { user: User })
        .user.id;
    }
    const status:"active"|"complete" = req.body.status
    const createdOrder = await store.create(userId!, status);
    res.json(createdOrder );
  } catch (error) {
    res.status(401);
    res.json({ error: error });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const order = await store.show(+orderId);
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(401);
    res.json(error);
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    const orderId = req.params.orderId;    
    const product = await store.addProduct(productId, quantity, +orderId);
    res.json(product);
  } catch (error) {
    console.log("handler error : ",error)
    res.status(401);
    res.json(error);
  }
};

const indexProducts = async (req: Request, res: Response) => {
  const orderId = +req.params.orderId;
  try {
    if (isNaN(orderId)) throw new Error("please provide order id as a number");
    const order_products = await store.indexProducts(orderId);
    res.json(order_products);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const indexCompletedOrders = async (req: Request, res: Response) => {
  let userId: number = +req.params.userId;
  if (isNaN(userId)) {
    // if failed to fetch user id from paramaters we will use the token to get the user id.
    const token = req.headers.authorization?.split(" ")[1];
    const decoded: User = jwt.verify(token!, process.env.SECRET_KEY!) as User;
    userId = decoded.id;
  }

  try {
    const result = store.completedOrders(userId);
    res.json(result);
  } catch (error) {
    res.status(401);
    res.json(error);
  }
};
export default orderRoutes;
