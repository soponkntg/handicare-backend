import express from "express";
import dotenv from "dotenv";
import sequelize from "./database";
const Location = require("./models/location");

dotenv.config();
const app = express();

sequelize
  .sync({ force: true })
  // .sync()
  .then((result: any) => {
    console.log(result);
    const port = process.env.PORT || 3000;
    app.listen(port, () =>
      console.log(`Listening on http://localhost:${port}`)
    );
  })
  .catch((err: any) => {
    console.log(err);
  });
