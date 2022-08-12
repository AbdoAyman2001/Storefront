"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../models/products");
const orders_1 = require("./orders");
const store = new products_1.ProductStore();
const productRoutes = (app) => {
    app.get("/products", index);
    app.post("/products", orders_1.verifyAuthMiddleWare, create);
    app.get("/products/:id", show);
    app.delete("/products/:id", orders_1.verifyAuthMiddleWare, delete_);
};
const index = async (req, res) => {
    try {
        const products = await store.index();
        res.json(products);
    }
    catch (err) {
        res.status(401);
        res.json({ error: err });
    }
};
const create = async (req, res) => {
    try {
        const name = req.body.name;
        const price = +req.body.price;
        const category = req.body.category;
        const createdProduct = await store.create(name, price, category);
        res.json(createdProduct);
    }
    catch (error) {
        console.log(error);
        res.status(401);
        res.json({ error: error });
    }
};
const show = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await store.show(+productId);
        res.json(product);
    }
    catch (error) {
        res.status(401);
        res.json({ error: error });
    }
};
const delete_ = async (req, res) => {
    const id = +req.params.id;
    try {
        if (isNaN(id))
            throw new Error("please provde proper id");
        const deletedProduct = await store.delete(id);
        res.json(deletedProduct);
    }
    catch (err) {
        res.status(401);
        res.json(err);
    }
};
exports.default = productRoutes;
