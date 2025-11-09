import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";       // ← add this
import Account from "../models/Account.js";

dotenv.config();                  // ← ensure .env is loaded

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET in auth.js:", JWT_SECRET); // optional debug

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingAccount = await Account.findOne({ email });
    if (existingAccount) return res.status(400).json({ message: "Account already exists" });

    const account = await Account.create({ name, email, password, role });

    const token = jwt.sign(
      { id: account._id, role: account.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    


    res.status(201).json({
      user: { id: account._id, name: account.name, email: account.email, role: account.role },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const account = await Account.findOne({ email });
    if (!account) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await account.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
    const token = jwt.sign(
      { id: account._id, role: account.role },
      JWT_SECRET,
      { expiresIn: "7d" }

    );
    


    res.status(200).json({
      user: { id: account._id, name: account.name, email: account.email, role: account.role },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;
