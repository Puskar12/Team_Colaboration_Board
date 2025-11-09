import jwt from "jsonwebtoken";
import Account from "../models/Account.js";
import dotenv from "dotenv";
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET in middleware:", process.env.JWT_SECRET);

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token);

      console.log("JWT_SECRET used for verify:", JWT_SECRET);

      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Authorization header:", req.headers.authorization);
      console.log("JWT_SECRET in middleware:", JWT_SECRET);
      console.log("Decoded payload:", decoded);

      req.user = await Account.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
