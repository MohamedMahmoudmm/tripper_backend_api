

//getbyhotelid

// getbyplaceid

// getbyexpireiceid

// createhotelrating

// createplacerating

// createexperiancerating

//get all comments and reviews for a specific hotel, place, experiance


// controllers/reviewController.js
// controllers/reviewController.js
import Hotel from "../models/hotel_model.js";
import Place from "../models/place_model.js";
import Experiance from "../models/experiance_model.js";
import Review from "../models/review_model.js";
import mongoose from "mongoose";
const models = { Hotel, Place, Experiance };

export const addReview = async (req, res) => {
  try {
    const { refModel, refId, rating, comment } = req.body;
    const userId = req.user._id;

    // تحقق من الموديل المطلوب
    const Target = models[refModel];
    if (!Target) return res.status(400).json({ message: "Invalid model" });

    // تأكد أن العنصر موجود
    const item = await Target.findById(refId);
    if (!item) return res.status(404).json({ message: `${refModel} not found` });

    // تأكد المستخدم ما قيّمش قبل كده
    const existing = await Review.findOne({ refId, refModel, userId });
    if (existing)
      return res.status(400).json({ message: "You already reviewed this item" });

    // أضف التقييم
    await Review.create({ refModel, refId, userId, rating, comment });

    // احسب المتوسط الجديد
const result = await Review.aggregate([
  {
    $match: {
      refModel,
      refId: { $eq: new mongoose.Types.ObjectId(refId) }
    }
  },
  {
    $group: {
      _id: null,
      avg: { $avg: "$rating" }
    }
  }
]);

    const avg = result.length ? result[0].avg.toFixed(1) : 0;
    await Target.findByIdAndUpdate(refId, { starRating: avg });

    res.json({ message: "Review added successfully", averageRating: avg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { refModel, refId } = req.params;

    // تأكد أن refModel صحيح
    if (!["Hotel", "Place", "Experiance"].includes(refModel)) {
      return res.status(400).json({ message: "Invalid model type" });
    }

    // هات كل التقييمات الخاصة بالعنصر
    const reviews = await Review.find({ refModel, refId })
      .populate("userId", "name email") // لو عايز بيانات المستخدم
      .sort({ createdAt: -1 }); // الأحدث أولاً

    res.json({ count: reviews.length, reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
