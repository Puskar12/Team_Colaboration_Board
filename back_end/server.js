import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import boardRoutes from "./routes/boardRoutes.js";
import authRoutes from "./routes/auth.js";


console.log("JWT_SECRET:", process.env.JWT_SECRET); // temporary debug

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => res.send("Backend is running "));

// Routes
app.use("/api/boards", boardRoutes);
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
