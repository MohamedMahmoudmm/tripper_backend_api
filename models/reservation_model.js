import mongoose from "mongoose";

const reservationSchema = mongoose.Schema({
  guestId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
  roomId: { type: mongoose.Schema.Types.ObjectId }, // 🆕 optional room
  experienceId: { type: mongoose.Schema.Types.ObjectId, ref: "Experiance" },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  checkIn: { type: Date },
  checkOut: { type: Date },
  guestsCount: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.model("Reservation", reservationSchema);
