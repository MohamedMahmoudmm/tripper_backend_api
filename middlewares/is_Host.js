export const host = (req, res, next) => {
  if (req.user && req.user.activeRole === "host") {
    next();
  } else {
    res.status(403).json({status:"fail", message: "host access only" });
  }
};