
 import { auth } from "../middlewares/is_Auth.js";
import express from "express";
import { addReview, getReviews } from "../controller/Review.js";
 const reviewRouter = express.Router()

reviewRouter.post('/addReview',auth,addReview)
reviewRouter.get("/:refModel/:refId", getReviews);
export default reviewRouter;