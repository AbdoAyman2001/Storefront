import express, { Request, Response } from "express";
import { UserStore } from "../models/users";
import jwt from "jsonwebtoken";
import { verifyAuthMiddleWare } from "./orders";

const store = new UserStore();

const usersRoutes = (app: express.Application) => {
  app.get("/users", verifyAuthMiddleWare, index);
  app.get("/users/:id", verifyAuthMiddleWare, show);
  app.post("/signup", create);
  app.post("/login", authenticate);
  app.delete("/users/:userId", verifyAuthMiddleWare, deleteHandler);
};

const index = async (req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400);
    res.json({ error: err });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id: number = +req.params.id;
    const user = await store.show(id);
    res.json(user);
  } catch (error) {
    res.status(400);
    res.json({ error: error });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const user = await store.create(firstName, lastName, password);

    const token = jwt.sign({ user: user }, process.env.SECRET_KEY!);

    res.json(token);
  } catch (error) {
    res.status(400);
    res.json({ error: error });
  }
};

const deleteHandler = async (req: Request, res: Response) => {
  try {
    let userId = +req.params.userId;
    if (isNaN(userId)) throw new Error("userId param is not a number");
    const deletedUser = store.delete(userId);
    res.json(deletedUser);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;

    const user = await store.authenticate(firstName, lastName, password);

    if (user) {
      const token = jwt.sign({ user: user }, process.env.SECRET_KEY!);
      res.json(token);
    }
  } catch (err) {
    res.status(400);
    res.json({ error: err });
  }
};

export default usersRoutes;
