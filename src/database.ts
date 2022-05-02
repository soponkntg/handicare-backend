import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD as string;
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  dialect: "mysql",
  host: dbHost,
  logging: process.env.NODE_ENV === "production" ? false : true,
});

export default sequelize;
