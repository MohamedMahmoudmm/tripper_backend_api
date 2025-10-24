import Reservation from "../models/reservation_model.js";
import HotelModel from "../models/hotel_model.js";
import ExperienceModel from "../models/experiance_model.js";
import { asyncHandler } from "../middlewares/errorHandler.js";


export const createReservation = asyncHandler(async (req, res) => {
  const { hotelId, experienceId, checkIn, checkOut, guestsCount } = req.body;
  const guestId = req.user._id;

  if (!hotelId && !experienceId) {
    return res.status(400).json({ message: "Hotel or Experience ID is required" });
  }

  let totalPrice = 0;

  if (hotelId) {
    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const nights =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    totalPrice = nights * hotel.price;
  }

  if (experienceId) {
    const experience = await ExperienceModel.findById(experienceId);
    if (!experience) return res.status(404).json({ message: "Experience not found" });

    totalPrice = guestsCount * experience.price;
  }

  const reservation = new Reservation({
    guestId,
    hotelId,
    experienceId,
    totalPrice,
    checkIn,
    checkOut,
    guestsCount,
  });

  const saved = await reservation.save();
  res.status(201).json(saved);
});

export const getAllReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find()
    .populate("guestId", "name email")
    .populate("hotelId", "name price")
    .populate("experienceId", "name price");
  res.status(200).json(reservations);
});

export const getUserReservations = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const reservations = await Reservation.find({ guestId: userId })
    .populate("hotelId", "name price images")
    .populate("experienceId", "name price images");
  res.status(200).json(reservations);
});

export const updateReservationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const updated = await Reservation.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updated) return res.status(404).json({ message: "Reservation not found" });

  res.status(200).json(updated);
});

export const filterReservationsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const reservations = await Reservation.find(filter)
    .populate("guestId", "name email")
    .populate("hotelId", "name")
    .populate("experienceId", "name");
  res.status(200).json(reservations);
});
