import express from "express";

import myRestaurantController from "../controllers/myRestaurantController";
import upload from "../middlewares/multer";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import { validateMyRestaurantRequest } from "../middlewares/validation";

const router = express.Router();

router
  .route("/")
  .get(jwtCheck, jwtParse, myRestaurantController.getMyRestaurant)
  .post(
    upload.single("imageFile"),
    validateMyRestaurantRequest,
    jwtCheck,
    jwtParse,
    myRestaurantController.createMyRestaurant
  )
  .put(
    upload.single("imageFile"),
    validateMyRestaurantRequest,
    jwtCheck,
    jwtParse,
    myRestaurantController.updateMyRestaurant
  );
export default router;
