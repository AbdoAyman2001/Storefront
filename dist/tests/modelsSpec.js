"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../models/orders");
const products_1 = require("../models/products");
const users_1 = require("../models/users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const productStore = new products_1.ProductStore();
const orderStore = new orders_1.OrderStore();
const userStore = new users_1.UserStore();
describe("Users", () => {
    describe("Methods defined", () => {
        it("index method should be defined", () => {
            expect(userStore.index).toBeDefined();
        });
        it("create method should be defined", () => {
            expect(userStore.create).toBeDefined();
        });
        it("authenticate method should be defined", () => {
            expect(userStore.authenticate).toBeDefined();
        });
        it("show method should be defined", () => {
            expect(userStore.show).toBeDefined();
        });
        it("expect delete method to be defineed", () => {
            expect(userStore.delete).toBeDefined();
        });
    });
    describe("Methods Working", () => {
        it("should find database empty", async () => {
            const result = await userStore.index();
            expect(result.length).toEqual(0);
        });
        it("should create user", async () => {
            const result = await userStore.create("Abdo", "Ayman", "password123");
            expect(result.id).toEqual(1);
            expect(result.firstname).toEqual("Abdo");
            expect(result.lastname).toEqual("Ayman");
            expect(bcrypt_1.default.compareSync("password123" + process.env.PEPPER, result.password)).toBeTrue();
        });
        it("should find created user in the database", async () => {
            const result = await userStore.show(1);
            expect(result.id).toEqual(1);
            expect(result.firstname).toEqual("Abdo");
            expect(result.lastname).toEqual("Ayman");
            expect(bcrypt_1.default.compareSync("password123" + process.env.PEPPER, result.password)).toBeTrue();
        });
        it("should authenticate correctly", async () => {
            const user = await userStore.authenticate("Abdo", "Ayman", "password123");
            expect(user).toBeTruthy();
        });
        it("should authenticate incorrectly - wrong password", async () => {
            const result = await userStore.authenticate("Abdo", "Ayman", "password12");
            expect(result).toBeNull();
        });
        it("should authenticate incorrectly - wrong firstName", async () => {
            const result = await userStore.authenticate("Abda", "Ayman", "password123");
            expect(result).toBeNull();
        });
        it("expect user to be deleted", async () => {
            const result = await userStore.delete(1);
            expect(result.id).toEqual(1);
            expect(result.firstname).toEqual("Abdo");
            expect(result.lastname).toEqual("Ayman");
            expect(bcrypt_1.default.compareSync("password123" + process.env.PEPPER, result.password)).toBeTrue();
        });
    });
});
describe("Testing Products", () => {
    describe("Methods are defined", () => {
        it("method index to be defined ", () => {
            expect(productStore.index).toBeDefined();
        });
        it("method create to be defined ", () => {
            expect(productStore.create).toBeDefined();
        });
        it("method show to be defined ", () => {
            expect(productStore.show).toBeDefined();
        });
        it("method delete to be defined ", () => {
            expect(productStore.delete).toBeDefined();
        });
    });
    describe("Methods to Function Correctly", () => {
        it("expect products to be empty ", async () => {
            const result = await productStore.index();
            expect(result.length).toBe(0);
        });
        it("expect product to be created correctly", async () => {
            const prod = await productStore.create("apples", 9, "fruit");
            expect(prod).toEqual({
                id: 1,
                name: "apples",
                price: 9,
                category: "fruit",
            });
        });
        it("Expect showing the first product", async () => {
            const prod = await productStore.show(1);
            expect(prod).toEqual({
                id: 1,
                name: "apples",
                price: 9,
                category: "fruit",
            });
        });
        it("expect deleting the first product", async () => {
            const prod = await productStore.delete(1);
            expect(prod).toEqual({
                id: 1,
                name: "apples",
                price: 9,
                category: "fruit",
            });
        });
        it("expect products to be empty again", async () => {
            const prods = await productStore.index();
            expect(prods.length).toBe(0);
        });
    });
});
describe("Testing Orders", () => {
    describe("expect methods to be defined", () => {
        it("expect index (fetching user's orders) to be defined", () => {
            expect(orderStore.index).toBeDefined();
        });
        it("expect show to be defined", () => {
            expect(orderStore.show).toBeDefined();
        });
        it("expect create to be defined", () => {
            expect(orderStore.create).toBeDefined();
        });
        it("expect addProduct to be defined", () => {
            expect(orderStore.addProduct).toBeDefined();
        });
    });
    describe("methods to function correctly ", () => {
        beforeAll(async () => {
            const createdUser = await userStore.create("Abdo", "Ayman", "password123");
            const createdProduct = await productStore.create("apples", 10, "fruit");
        });
        afterAll(async () => {
            await productStore.delete(2);
            await userStore.delete(2);
        });
        it("expect orders to be empty", async () => {
            const orders = await orderStore.index(1);
            expect(orders).toEqual([]);
        });
        it("expect creating order", async () => {
            const createdOrder = await orderStore.create(2, "active");
            expect(createdOrder).toEqual({
                id: 1,
                user_id: 2,
                status: "active",
            });
        });
        it("expect order to be added", async () => {
            const onlyOrder = await orderStore.show(1);
            expect(onlyOrder).toEqual({
                id: 1,
                user_id: 2,
                status: "active",
            });
        });
        it("expect adding product to an order ", async () => {
            const result = await orderStore.addProduct(2, 10, 1);
            expect(result).toEqual({
                id: 1,
                order_id: 1,
                product_id: 2,
                quantity: 10,
            });
            await orderStore.addProduct(2, 10, 1);
        });
        it("expect fetch all products for an order", async () => {
            const prods = await orderStore.indexProducts(1);
            expect(prods).toEqual([
                { id: 1, order_id: 1, product_id: 2, quantity: 10 },
                { id: 2, order_id: 1, product_id: 2, quantity: 10 },
            ]);
        });
    });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
