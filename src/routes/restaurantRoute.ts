import express from "express";

import restaurantController from "../controllers/restaurantController";
import {
  validateGetRestaurantRequest,
  validateSearchRestaurantRequest,
} from "../middlewares/validation";

const router = express.Router();

router.get(
  "/:restaurantId",
  validateGetRestaurantRequest,
  restaurantController.getRestaurant
);

router.get(
  "/search/:city",
  validateSearchRestaurantRequest,
  restaurantController.searchRestaurants
);

export default router;
