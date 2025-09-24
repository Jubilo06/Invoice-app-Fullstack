import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import configurePassport from "../strategy/passport.mjs";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import cors from "cors";
import routes from "../routes/index.mjs";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(passport.initialize());
configurePassport(passport);
app.use("/api",routes);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to Mongo atlas"))
  .catch((err) => console.log(`Error:${err}`));

app.use(cookieParser());
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
