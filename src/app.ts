import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { initDB } from "./models/index";
import dataRoutes from "./routes/data";
import accountRoutes from "./routes/account";
import errorRoutes from "./routes/error";
import fs from "fs";
import http from "http";
import https from "https";

dotenv.config();
const app = express();
const jsonParser = bodyParser.json();

initDB();

app.use("/data", jsonParser, dataRoutes);
app.use("/account", jsonParser, accountRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("success");
});
app.use(errorRoutes);

const port = process.env.PORT || 4000;
if (process.env.NODE_ENV === "production") {
  var privateKey = fs.readFileSync(
    "/etc/nginx/ssl/live/api.handicare.site/privkey.pem"
  );
  var certificate = fs.readFileSync(
    "/etc/nginx/ssl/live/api.handicare.site/fullchain.pem"
  );

  var credentials = { key: privateKey, cert: certificate };
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port);
}
if (process.env.NODE_ENV === "development") {
  var httpServer = http.createServer(app);
  httpServer.listen(port);
}
