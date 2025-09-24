import express from 'express'
import cookieParser from 'cookie-parser'; 
import session from 'express-session'; 
import passport  from 'passport'; 
import mongoose from 'mongoose';
import configurePassport from "../strategy/passport.mjs"; 
import MongoStore from "connect-mongo";
import dotenv from 'dotenv'
import cors from 'cors'
import routes from "../routes/index.mjs";

dotenv.config();
const app=express()
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow any origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allow all methods
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  ); // Allow all headers
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(passport.initialize());
configurePassport(passport);
app.use(routes);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to Mongo atlas"))
  .catch((err) => console.log(`Error:${err}`));

app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 5014;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
