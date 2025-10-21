import { handleValidationErrors } from "../Validators/handleValidationErrors.js";
import { signupValidations } from "../Validators/signupValidations.js";
import { signup } from "../controller/user.controller.js";
import { isEmailExists } from "../middleware/isEmailExists.js";
import express from "express";
const userRouter = express.Router()


userRouter.post('/signup', signupValidations ,handleValidationErrors, isEmailExists, signup)
