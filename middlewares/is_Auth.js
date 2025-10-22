import jwt from "jsonwebtoken";
import User from "../models/user_model.js";

export const auth = async (req, res, next) => {
  try {
    let token = req.headers.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    let decoded = jwt.verify(token, "secret");

    let user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};