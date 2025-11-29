import User from "../models/user_model.js";

export const host = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    if (user.activeRole === "host") {
      next();
    } else {
      res.status(403).json({ status: "fail", message: "Host access only" });
    }
  } catch (err) {
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};