import express from "express";

import restaurantController from "../controllers/restaurantController";
import { validateRestaurantRequest } from "../middlewares/validation";

const router = express.Router();

router.get(
  "/search/:city",
  validateRestaurantRequest,
  restaurantController.searchRestaurants
);

export default router;
