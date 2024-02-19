import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

import connectDatabse from "./config/database";
import corsOptions from "./config/corsOptions";
import cloudinaryConfig from "./config/cloudinary";
import errorHandler from "./middlewares/errorHandler";
import { logEvents, logger } from "./utils/logger";

import myUserRoute from "./routes/myUserRoute";
import myRestaurantRoute from "./routes/myRestaurantRoute";
import restaurantRoute from "./routes/restaurantRoute";
import orderRoute from "./routes/orderRoute";

const app = express();

const PORT = process.env.PORT || 5000;

console.log(process.env.NODE_ENV);

connectDatabse();

cloudinaryConfig;

app.use(logger);

app.use(cors(corsOptions));

app.use("/api/v1/order/checkout/webhook", express.raw({ type: "*/*" }));

app.use(express.json());

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

app.use("/api/v1/my/user", myUserRoute);
app.use("/api/v1/my/restaurant", myRestaurantRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/order", orderRoute);

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log(`Mongodb connecté: ${mongoose.connection.host}`);
  app.listen(PORT, () => console.log(`Serveur connecté sur le port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
