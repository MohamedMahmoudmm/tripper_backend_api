import { body } from "express-validator";

const addPlaceValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Place Name cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Place Name must be at least 3 characters long")
    .isLength({ max: 20 })
    .withMessage("Place Name cannot be more than 20 characters long"),
  body("address.country")
    .trim()
    .notEmpty()
    .withMessage("Country cannot be empty"),
  body("address.city").trim().notEmpty().withMessage("City cannot be empty"),
];
export default addPlaceValidation;