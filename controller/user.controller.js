import { asyncHandler } from "../middlewares/errorHandler.js";
import User from "../models/user_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { template } from "../email/emailTemplate.js";
import sendEmail from "../email/email.js";

// signup
export const signup = asyncHandler(async (req, res) => {
  req.body.password = await bcrypt.hash(req.body.password, 8);
  let user = await User.insertMany(req.body);
  user[0].password = undefined;
    const token = jwt.sign({ email: req.body.email }, "myEmail", {
    expiresIn: "1h",
  });
  const verificationLink = `http://localhost:4000/verify/${token}`;
  const htmlTemplate = template(verificationLink);
  await sendEmail(req.body.email, "Verify Your Email", htmlTemplate);
  res.status(201).json({ message: "User created successfully", data: user });
});

//signin
export const signin = asyncHandler(async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(401).json({ message: "Invalid email or password" });
  if(user.isConfirmed === false) return res.status(401).json({ message: "User not confirmed" });
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

//swithchRole[guest-host]
// export const switchRole = asyncHandler(async(req,res)=>{

// })

//verifyIdentity[nationalId]
// export const verifyIdentity = asyncHandler(async(req,res)=>{

// })

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

// export const getUserProfile = asyncHandler(async(req,res)=>{

// })
