import express from "express";
import dotenv from "dotenv";
import { initDB } from "./models/index";
import dataRoutes from "./routes/data";
import accountRoutes from "./routes/account";

dotenv.config();
const app = express();

initDB();

app.use("/data", dataRoutes);
app.use("/account", accountRoutes);
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
