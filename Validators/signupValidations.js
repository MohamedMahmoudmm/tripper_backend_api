import { body } from "express-validator";
const signupValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 20 })
    .withMessage("Name cannot be more than 20 characters long"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isLength({ max: 12 })
    .withMessage("Password cannot be more than 12 characters long"),
  body("phone").trim().notEmpty().withMessage("Phone number cannot be empty"),
];
export { signupValidation };
