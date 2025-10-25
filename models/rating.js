import mongoose from "mongoose";

const reviewHotelSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 0, max: 5 },
  comment: String,
}, { timestamps: true });

const reviewPlaceSchema = new mongoose.Schema({
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 0, max: 5 },
  comment: String,
}, { timestamps: true });

const reviewExperianceSchema = new mongoose.Schema({
  experianceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experiance', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 0, max: 5 },
  comment: String,
}, { timestamps: true });

export const ReviewHotel = mongoose.model('ReviewHotel', reviewHotelSchema);
export const ReviewPlace = mongoose.model('ReviewPlace', reviewPlaceSchema);
export const ReviewExperiance = mongoose.model('ReviewExperiance', reviewExperianceSchema);
