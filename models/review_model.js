// models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
    comment: String,
    refModel: {
      type: String,
      required: true,
      enum: ["Hotel", "Place", "Experiance"], // 👈 الأنواع اللي ممكن يتقيموا
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "refModel", // 👈 هنا السحر: بيختار الـ ref على حسب refModel
    },
  },
  { timestamps: true }
);
const Review = mongoose.model("Review", reviewSchema);
export default Review;
