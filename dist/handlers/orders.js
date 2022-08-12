"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthMiddleWare = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const orders_1 = require("../models/orders");
const store = new orders_1.OrderStore();
const verifyAuthMiddleWare = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        next();
    }
    catch (err) {
        res.status(401);
        res.json({ error: err });
    }
};
exports.verifyAuthMiddleWare = verifyAuthMiddleWare;
const orderRoutes = (app) => {
    app.get("/orders/:userId", exports.verifyAuthMiddleWare, index);
    app.post("/orders/:userId", exports.verifyAuthMiddleWare, create);
    app.get("/order/:orderId", exports.verifyAuthMiddleWare, show);
    app.post("/orders/:orderId/products", exports.verifyAuthMiddleWare, addProduct);
    app.get("/orders/:orderId/products", indexProducts);
    app.get("/completed-orders/:userId", exports.verifyAuthMiddleWare, indexCompletedOrders);
};
const index = async (req, res) => {
    try {
        let userId = +req.params.userId;
        if (isNaN(userId)) {
            // if failed to fetch user id from paramaters we will use the token to get the user id.
            const token = req.headers.authorization?.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            userId = decoded.id;
        }
        const Products = await store.index(+userId);
        res.json(Products);
    }
    catch (error) {
        res.status(401);
        res.json({ error: error });
    }
};
const create = async (req, res) => {
    try {
        let userId = +req.params.uesrId;
        if (isNaN(userId)) {
            const token = req.headers.authorization?.split(" ")[1];
            userId = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY)
                .user.id;
        }
        const status = req.body.status;
        const createdOrder = await store.create(userId, status);
        res.json(createdOrder);
    }
    catch (error) {
        res.status(401);
        res.json({ error: error });
    }
};
const show = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await store.show(+orderId);
        res.json(order);
    }
    catch (error) {
        console.log(error);
        res.status(401);
        res.json(error);
    }
};
const addProduct = async (req, res) => {
    try {
        const productId = req.body.productId;
        const quantity = req.body.quantity;
        const orderId = req.params.orderId;
        const product = await store.addProduct(productId, quantity, +orderId);
        res.json(product);
    }
    catch (error) {
        console.log("handler error : ", error);
        res.status(401);
        res.json(error);
    }
};
const indexProducts = async (req, res) => {
    const orderId = +req.params.orderId;
    try {
        if (isNaN(orderId))
            throw new Error("please provide order id as a number");
        const order_products = await store.indexProducts(orderId);
        res.json(order_products);
    }
    catch (err) {
        res.status(401);
        res.json(err);
    }
};
const indexCompletedOrders = async (req, res) => {
    let userId = +req.params.userId;
    if (isNaN(userId)) {
        // if failed to fetch user id from paramaters we will use the token to get the user id.
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        userId = decoded.id;
    }
    try {
        const result = store.completedOrders(userId);
        res.json(result);
    }
    catch (error) {
        res.status(401);
        res.json(error);
    }
};
exports.default = orderRoutes;
