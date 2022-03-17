import express from "express";
import dataController from "../controllers/data";
const router = express.Router();

router.get("/recommend/location", dataController.getRecommendLocation);
router.get("/recommend/restaurant", dataController.getRecommendRestaurant);
router.get("/locations", dataController.getAllLocation);
router.post("/place", dataController.postPlace);

export default router;
