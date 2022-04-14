import express, { Request, Response, NextFunction } from "express";
import errorController from "../controllers/error";
const router = express.Router();

router.use(errorController);

export default router;
