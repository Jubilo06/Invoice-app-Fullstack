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
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*"); // Allow any origin
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allow all methods
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   ); // Allow all headers
//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   next();
// });
app.options("*", cors());
// app.use(
//   cors({
//     origin: true, // Allow all origins (quick fix; restrict later)
//     credentials: true, // Essential for cookies/sessions on mobile
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "Cookie",
//       "X-Requested-With",
//     ],
//     exposedHeaders: ["Set-Cookie"], // Allow backend to set cookies
//   })
// );
app.use(
  cors({
    origin: true, // Allow all origins (mobile/PC/Vercel)
    credentials: true, // Cookies cross-origin
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"], // Include OPTIONS
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Cookie",
      "Referer",
    ],
    exposedHeaders: ["Set-Cookie", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 200, // Some browsers expect 200, not 204
  })
);
app.use((req, res, next) => {
  console.log(
    `Vercel Request: ${req.method} ${req.path} | Origin: ${
      req.headers.origin || "No Origin"
    } | UA: ${req.headers["user-agent"]?.slice(0, 40)}`
  );
  if (req.method === "OPTIONS") {
    console.log("OPTIONS Preflight Handled");
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
app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 5014;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
