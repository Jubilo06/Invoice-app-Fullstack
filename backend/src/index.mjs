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
import path from "path";
import { fileURLToPath } from "url"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();
const app=express()

app.use(
  cors({
    origin: true, 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
    ],
    exposedHeaders: ["Set-Cookie"],
  })
);



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
app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 5014;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
