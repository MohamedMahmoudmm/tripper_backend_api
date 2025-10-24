import { handleValidationErrors } from "../Validators/handleValidationErrors.js";
import { signupValidation } from "../Validators/signupValidations.js";
import { confirmEmail, filterUsersByStatus, getUserProfile, signin, signup, switchRole, uploadIdentity, verifyIdentity } from "../controller/user.controller.js";
import { isEmailExists } from "../middlewares/isEmailExists.js";
import { auth } from "../middlewares/is_Auth.js";
import { admin } from "../middlewares/is_Admin.js";
import express from "express";
import upload from "../middlewares/identity_cards.js";

 const userRouter = express.Router()
userRouter.post('/signup', signupValidation ,handleValidationErrors, isEmailExists, signup)
userRouter.post('/signin',signin),
userRouter.get("/verify/:token", confirmEmail);
userRouter.patch("/upload-id", auth, upload.single("identityImageUrl"), uploadIdentity);
userRouter.patch("/switch-role", auth, switchRole);
userRouter.patch("/verify/:userId", auth, admin, verifyIdentity);
userRouter.get("/filter", auth, admin, filterUsersByStatus)
userRouter.get("/profile/:id", auth, getUserProfile)
export default userRouter