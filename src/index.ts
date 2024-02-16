import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import "dotenv/config";

import connectDatabse from "./config/database";
import corsOptions from "./config/corsOptions";
import errorHandler from "./middlewares/errorHandler";
import { logEvents, logger } from "./utils/logger";

import root from "./routes/root";
import myUserRoute from "./routes/myUserRoute";

const app = express();

const PORT = process.env.PORT || 5000;

console.log(process.env.NODE_ENV);

connectDatabse();

app.use(logger);

app.use(cors(corsOptions));
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "/public")));

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

app.use("/", root);
app.use("/api/v1/my/user", myUserRoute);

app.all("*", (req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Introuvable" });
  } else {
    res.type("txt").send("404 Introuvable");
  }
});

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