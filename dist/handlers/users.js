"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../models/users");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const orders_1 = require("./orders");
const store = new users_1.UserStore();
const usersRoutes = (app) => {
    app.get("/users", orders_1.verifyAuthMiddleWare, index);
    app.get("/users/:id", orders_1.verifyAuthMiddleWare, show);
    app.post("/signup", create);
    app.post("/login", authenticate);
    app.delete("/users/:userId", orders_1.verifyAuthMiddleWare, deleteHandler);
};
const index = async (req, res) => {
    try {
        const users = await store.index();
        res.json(users);
    }
    catch (err) {
        res.status(400);
        res.json({ error: err });
    }
};
const show = async (req, res) => {
    try {
        const id = +req.params.id;
        const user = await store.show(id);
        res.json(user);
    }
    catch (error) {
        res.status(400);
        res.json({ error: error });
    }
};
const create = async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        const user = await store.create(firstName, lastName, password);
        const token = jsonwebtoken_1.default.sign({ user: user }, process.env.SECRET_KEY);
        res.json(token);
    }
    catch (error) {
        res.status(400);
        res.json({ error: error });
    }
};
const deleteHandler = async (req, res) => {
    try {
        let userId = +req.params.userId;
        if (isNaN(userId))
            throw new Error("userId param is not a number");
        const deletedUser = store.delete(userId);
        res.json(deletedUser);
    }
    catch (err) {
        res.status(401);
        res.json(err);
    }
};
const authenticate = async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        const user = await store.authenticate(firstName, lastName, password);
        if (user) {
            const token = jsonwebtoken_1.default.sign({ user: user }, process.env.SECRET_KEY);
            res.json(token);
        }
    }
    catch (err) {
        res.status(400);
        res.json({ error: err });
    }
};
exports.default = usersRoutes;
