"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const products_1 = require("../models/products");
const orders_1 = require("../models/orders");
const dotenv_1 = __importDefault(require("dotenv"));
const orderStore = new orders_1.OrderStore();
const productStore = new products_1.ProductStore();
dotenv_1.default.config();
const request = (0, supertest_1.default)(server_1.default);
describe("Testing the API", () => {
    let SavedToken = describe("Testing users ", () => {
        it("expect creating new user", async () => {
            const payload = {
                firstName: "Abdo",
                lastName: "Ayman",
                password: "password123",
            };
            const result = await request.post("/signup").send(payload);
            expect(result.status).toBe(200);
            const token = JSON.parse(result.text);
            SavedToken = token;
            const user = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            expect(user.user.id).toBe(3);
            expect(user.user.firstname).toBe("Abdo");
            expect(user.user.lastname).toBe("Ayman");
        });
        it("expecting logging the new user in", async () => {
            const payload = {
                firstName: "Abdo",
                lastName: "Ayman",
                password: "password123",
            };
            const result = await request.post("/login").send(payload);
            const token = JSON.parse(result.text);
            const user = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            expect(user.user.id).toBe(3);
            expect(user.user.firstname).toBe("Abdo");
            expect(user.user.lastname).toBe("Ayman");
        });
        it("expect users to have one user", async () => {
            const result = await request
                .get("/users")
                .set({ Authorization: "Bearer " + SavedToken });
            expect(result.status).toBe(200);
            const users = JSON.parse(result.text);
            expect(users.length).toEqual(1);
            expect(users[0].id).toBe(3);
            expect(users[0].firstname).toBe("Abdo");
            expect(users[0].lastname).toBe("Ayman");
        });
        it("expect to show the first user ", async () => {
            const result = await request
                .get("/users/3")
                .set({ authorization: "Bearer " + SavedToken });
            const user = JSON.parse(result.text);
            expect(user.id).toBe(3);
            expect(user.firstname).toBe("Abdo");
            expect(user.lastname).toBe("Ayman");
        });
        it("expect to index users", async () => {
            const result = await request
                .get("/users")
                .set({ authorization: "Bearer " + SavedToken });
            const users = JSON.parse(result.text);
            expect(users.length).toEqual(1);
            expect(users[0].id).toBe(3);
            expect(users[0].firstname).toBe("Abdo");
            expect(users[0].lastname).toBe("Ayman");
        });
    });
    describe("Testing Products", () => {
        it("expect products to be empty", async () => {
            const result = await request.get("/products");
            expect(result.status).toBe(200);
            const products = JSON.parse(result.text);
            expect(products.length).toBe(0);
        });
        it("expect creating product correctly", async () => {
            const payload = {
                name: "apples",
                price: 10,
                category: "fruit",
            };
            const result = await request
                .post("/products")
                .set({ Authorization: "Bearer " + SavedToken })
                .send(payload);
            expect(result.status).toBe(200);
            const createdProduct = JSON.parse(result.text);
            expect(createdProduct).toEqual({
                id: 3,
                name: "apples",
                price: 10,
                category: "fruit",
            });
        });
        it("expect products to have created product", async () => {
            const result = await request.get("/products");
            expect(result.status).toBe(200);
            const products = JSON.parse(result.text);
            expect(products.length).toBe(1);
            expect(products[0]).toEqual({
                id: 3,
                name: "apples",
                price: 10,
                category: "fruit",
            });
        });
        it("expect product to be deleted ", async () => {
            const result = await request
                .delete("/products/3")
                .set({ Authorization: "Bearer " + SavedToken });
            expect(result.status).toBe(200);
            const resp = JSON.parse(result.text);
            expect(resp).toEqual({
                id: 3,
                name: "apples",
                price: 10,
                category: "fruit",
            });
        });
        it("expect products to be empty again", async () => {
            const result = await request.get("/products");
            const resp = JSON.parse(result.text);
            expect(resp.length).toBe(0);
        });
    });
    /////////////////////////////////////////////////////////////////////
    describe("Testing orders", () => {
        beforeAll(async () => {
            const payload = {
                name: "apples",
                price: 10,
                category: "fruit",
            };
            const result = await request
                .post("/products")
                .set({ Authorization: "Bearer " + SavedToken })
                .send(payload);
        });
        it("expect orders to be empty", async () => {
            const response = await request
                .get("/orders/3")
                .set({ Authorization: "Bearer " + SavedToken });
            expect(response.status).toBe(200);
            const data = JSON.parse(response.text);
            expect(data.length).toBe(0);
        });
        it("expect order to be added ", async () => {
            const payload = {
                status: "active",
            };
            const response = await request
                .post("/orders/3")
                .set({ Authorization: "Bearer " + SavedToken })
                .send(payload);
            expect(response.status).toBe(200);
            const data = JSON.parse(response.text);
            expect(data).toEqual({
                id: 2,
                user_id: 3,
                status: "active",
            });
        });
        it("expect orders to have the order", async () => {
            const response = await request
                .get("/order/2")
                .set({ Authorization: "Bearer " + SavedToken });
            expect(response.status).toBe(200);
            const data = JSON.parse(response.text);
            expect(data).toEqual({
                id: 2,
                user_id: 3,
                status: "active",
            });
        });
        it("expects adding product to the order", async () => {
            const payload = {
                productId: 4,
                quantity: 10,
            };
            const response = await request
                .post("/orders/2/products")
                .set({ Authorization: "Bearer " + SavedToken })
                .send(payload);
            const data = JSON.parse(response.text);
            expect(response.status).toBe(200);
            expect(data).toEqual({ id: 3, order_id: 2, product_id: 4, quantity: 10 });
        });
        it("expect order's products to be indexed", async () => {
            const response = await request
                .get("/orders/2/products")
                .set({ Authorization: "Bearer " + SavedToken });
            expect(response.status).toBe(200);
            const data = JSON.parse(response.text);
            expect(data.length).toBe(1);
            expect(data[0]).toEqual({
                id: 3,
                order_id: 2,
                product_id: 4,
                quantity: 10,
            });
        });
    });
});
