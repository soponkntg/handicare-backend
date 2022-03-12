import express from "express";
import dotenv from "dotenv";
import { initDB } from "./models/index";

dotenv.config();
const app = express();

initDB();
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
