export const admin = (req, res, next) => {
  if (req.user && req.user.activeRole === "admin") {
    next();
  } else {
    res.status(403).json({status:"fail", message: "Admin access only" });
  }
};