import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/User.mjs";
import Invoice from "../models/Invoice.mjs";



const router = express.Router();
// const ensureAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.status(401).send("Please log in to view this resource.");
// };
const ensureAuthenticated = passport.authenticate("jwt", { session: false });
const logRequestBody = (req, res, next) => {
  console.log("--- NEW LOGIN REQUEST ---");
  console.log("Request Headers:", req.headers); // See all the headers
  console.log("Request Body:", req.body); // See what express.json() has parsed
  next(); // Pass control to the next handler
};

router.get("/api/profile", ensureAuthenticated, (req, res) => {
  // Passport puts the user info on `req.user`. We just send it back.
  res.json(req.user);
});

// Door 1: Register a new user
router.post("/api/register", async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username already exists.");
    }
    const newUser = new User({ firstName, lastName, username, password });
    await newUser.save();
    res.status(201).send("User registered successfully! Please log in.");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Door 2: Log a user in
// router.post("/login", passport.authenticate("local"), (req, res) => {
//   // If Passport gets past this point, the user is authenticated.
//   // We just send back a success message and some user info.
//   res.json({
//     message: "Login successful!",
//     user: {
//       id: req.user.id,
//       username: req.user.username,
//       firstName: req.user.firstName,
//     },
//   });
// });
// router.post(
//   "/api/login", logRequestBody,
//   passport.authenticate("local", { session: false }),
//   (req, res) => {
//     // If we get here, passport-local has confirmed the user is valid.
//     // The authenticated user is on `req.user`.

//     // 1. Create the "payload" - the information to put on the ID badge.
//     const payload = { id: req.user.id, username: req.user.username };

//     // 2. Sign the token, creating the JWT string.
//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     }); // Expires in 1 day

//     // 3. Send the token back to the frontend.
//     res.json({ message: "Login successful!", token: `Bearer ${token}` });
//   }
// );
router.post(
  "/api/login",
  // Your logging middleware (this is good for debugging)
  logRequestBody,

  // The passport bouncer
  passport.authenticate("local", { session: false }),

  // The final handler that runs ONLY on success
  (req, res) => {
    console.log("--- Login successful! Creating JWT. ---"); // Add this log!
    console.log(
      "Using JWT_SECRET:",
      process.env.JWT_SECRET ? "Found" : "NOT FOUND!"
    );
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in .env file!");
    }

    // If we get here, `req.user` contains the authenticated user from the database.
    const payload = {
      id: req.user.id,
      username: req.user.username,
      firstName: req.user.firstName,
    };
     console.log("Payload for JWT:", payload);

    // Sign the token using your secret key from .env
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token is valid for 1 day
    );
    console.log("JWT created successfully. Sending to client.");

    // Send the token back to the frontend in a JSON object.
    res.status(200).json({
      message: "Login successful!",
      token: `Bearer ${token}`,
      user: { 
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        username: req.user.username,
        companyName: req.user.companyName,
      }
      });
  }
);
router.put("/api/profile", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const newprofileData = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, newprofileData, {
      new: true,
    });
     if (!updatedUser) {
       return res.status(404).json({ message: "User not found" });
     }
    res.json({ message: "Profile updated!", user: updatedUser });
  } catch (error) {
    res.status(500).send({message:"Server error while updating profile"});
  }
});

router.delete("/api/me", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    await Invoice.deleteMany({ userId: userId });
    await User.findByIdAndDelete(userId);
    res
      .status(200)
      .json({
        message: "User account and all associated data deleted successfully.",
      });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ message: "Server error while deleting account." });
  }
});


export default router;
