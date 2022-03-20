import express, { Request, Response } from "express";
import accountController from "../controllers/account";
const router = express.Router();

router.post("/comment", accountController.comment);
router.post("/createUser", accountController.createUser);
router.get("/comments", accountController.getAllComment)

export default router;
