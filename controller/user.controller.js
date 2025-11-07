import { asyncHandler } from "../middlewares/errorHandler.js";
import User from "../models/user_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { template } from "../email/emailTemplate.js";
import sendEmail from "../email/email.js";

// signup
export const signup = asyncHandler(async (req, res) => {
  req.body.password = await bcrypt.hash(req.body.password, 8);

  let user = await User.create(req.body);
  user.password = undefined;

  const token = jwt.sign({ email: req.body.email }, "myEmail", {
    expiresIn: "1h",
  });

  const verificationLink = `http://localhost:4000/user/verify/${token}`;
  const htmlTemplate = template(verificationLink);

  try {
    await sendEmail(req.body.email, "Verify Your Email", htmlTemplate);
  } catch (error) {
    console.error("Email sending error:", error);
  }
  res.status(201).json({
    message: "User created successfully",
    data: user,
  });
});


//signin
export const signin = asyncHandler(async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(401).json({ message: "Invalid email or password" });
  if (user.isConfirmed === false) return res.status(401).json({ message: "User not confirmed" });
  let token = jwt.sign({ _id: user._id, activeRole: user.activeRole, email: user.email }, 'secret');
  return res.json({
    message: "Login successful",
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
      activeRole: user.activeRole,
    },
    token,
  });
});

//logout
export const logout = asyncHandler(async (req, res) => {
  return res.status(200).json({ message: "User logged out successfully" });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json(users);
});

//swithchRole[guest-host]
export const switchRole = asyncHandler(async (req, res) => {
  const { newRole } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.activeRole === "guest" && newRole === "host") {
    if (!user.identityImageUrl) {
      return res.status(400).json({ message: "Upload your ID first" });
    }
    if (user.isVerified !== "verified") {
      return res.status(400).json({ message: "Wait for admin approval" });
    }
  }
  if (!user.role.includes(newRole)) {
    user.role.push(newRole);
  }

  user.activeRole = newRole;
  await user.save();

  res.status(200).json({
    message: `Role switched to '${newRole}' successfully`,
    activeRole: user.activeRole,
  });

});


//verifyIdentity[nationalId]
export const verifyIdentity = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  if (!["verified", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid verification status" });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isVerified: status },
    { new: true }
  );

  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({
    message: `User verification updated to '${status}'`,
    user,
  });

});

//emailConfirmation[nodemailer]
export const confirmEmail = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, "myEmail");

    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { isConfirmed: true },
      { new: true }
    );

    if (!user) return res.status(404).send("User not found");
    // res.redirect("http://localhost:4000/signin");
  } catch (err) {
    console.error("Verify error:", err);
    // res.redirect("http://localhost:4000/signup");
  }
});

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId).select('name phone email role isConfirmed isVerified'); 
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({
      message: "User profile fetched successfully",
      user: {
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        isConfirmed: user.isConfirmed,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};
//uploadIdentityCard
export const uploadIdentity = asyncHandler(async (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "Please upload an ID image" });
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.identityImageUrl = req.file.path;
  user.isVerified = "pending";
  await user.save()
  res.status(200).json({
    message: "Identity uploaded successfully. Waiting for admin approval.",
    identityImage: user.identityImageUrl,
    status: user.isVerified,
  });

});

export const filterUsersByStatus = asyncHandler(async (req, res) => {
  const { isVerified } = req.query;
  const filter = isVerified ? { isVerified } : {};
  const users = await User.find(filter);
  res.status(200).json(users);
});