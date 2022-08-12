import express, { Request, Response } from "express";
import bodyParser from "body-parser";

import productRoutes from "./handlers/products";
import usersRoutes from "./handlers/users";
import orderRoutes from "./handlers/orders";

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(bodyParser.json());

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

usersRoutes(app);
orderRoutes(app);
productRoutes(app);

app.get("/", (req, res) => {
  res.json("hello world!");
});


export default app;