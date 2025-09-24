import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/User.mjs";
import Invoice from "../models/Invoice.mjs";



const router = express.Router();
const ensureAuthenticated = passport.authenticate("jwt", { session: false });
const logRequestBody = (req, res, next) => {
  console.log("--- NEW LOGIN REQUEST ---");
  console.log("Request Headers:", req.headers); // See all the headers
  console.log("Request Body:", req.body); // See what express.json() has parsed
  next(); // Pass control to the next handler
};

router.get("/profile", ensureAuthenticated, (req, res) => {
  // Passport puts the user info on `req.user`. We just send it back.
  res.json(req.user);
});

// Door 1: Register a new user
router.post("/register", async (req, res) => {
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

router.post(
  "/login",
  logRequestBody,
  passport.authenticate("local", { session: false }),
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
router.put("/profile", ensureAuthenticated, async (req, res) => {
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

router.delete("/me", ensureAuthenticated, async (req, res) => {
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
