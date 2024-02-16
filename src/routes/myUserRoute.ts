import express from "express";

import myUserController from "../controllers/myUserController";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import { validateMyUserRequest } from "../middlewares/validation";

const router = express.Router();

router
  .route("/")
  .get(jwtCheck, jwtParse, myUserController.getCurrentUser)
  .post(jwtCheck, myUserController.createCurrentUser)
  .put(
    jwtCheck,
    jwtParse,
    validateMyUserRequest,
    myUserController.updateCurrentUser
  );

export default router;
