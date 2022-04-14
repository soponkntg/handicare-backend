import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { initDB } from "./models/index";
import dataRoutes from "./routes/data";
import accountRoutes from "./routes/account";
import errorRoutes from "./routes/error";

dotenv.config();
const app = express();
const jsonParser = bodyParser.json();

initDB();

app.use("/data", jsonParser, dataRoutes);
app.use("/account", jsonParser, accountRoutes);
app.use(errorRoutes);
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
