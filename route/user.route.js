import { handleValidationErrors } from "../Validators/handleValidationErrors.js";
import { signupValidation } from "../Validators/signupValidations.js";
import { confirmEmail, signin, signup } from "../controller/user.controller.js";
import { isEmailExists } from "../middlewares/isEmailExists.js";
import express from "express";

 const userRouter = express.Router()
userRouter.post('/signup', signupValidation ,handleValidationErrors, isEmailExists, signup)
userRouter.post('/signin',signin),
userRouter.get("/verify/:token", confirmEmail);
export default userRouter