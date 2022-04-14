import express, { Request, Response } from "express";
import accountController from "../controllers/account";
const router = express.Router();

router.post("/location/comment", accountController.postLocationComment);
router.get("/location/morecomments", accountController.getMoreLocationComment);
router.post(
  "/restaurant/comment",
  accountController.postLocationRestaurantComment
);
router.get(
  "/restaurant/morecomments",
  accountController.getMoreLocationRestaurantComment
);
router.post("/createUser", accountController.createUser);

export default router;
