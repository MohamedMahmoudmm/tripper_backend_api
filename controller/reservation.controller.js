import Reservation from "../models/reservation_model.js";
import HotelModel from "../models/hotel_model.js";
import ExperienceModel from "../models/experiance_model.js";
import { asyncHandler } from "../middlewares/errorHandler.js";


export const createReservation = asyncHandler(async (req, res) => {
  const { hotelId, roomId, experienceId, checkIn, checkOut, guestsCount } = req.body;
  const guestId = req.user._id;

  if (!hotelId && !experienceId) {
    return res.status(400).json({ message: "Hotel or Experience ID is required" });
  }

  // ============================
  //  EXPERIENCE RESERVATION
  // ============================
  if (experienceId) {
    const experience = await ExperienceModel.findById(experienceId);
    if (!experience) return res.status(404).json({ message: "Experience not found" });

    const totalPrice = guestsCount * experience.price;

    const reservation = new Reservation({
      guestId,
      experienceId,
      totalPrice,
      checkIn,
      checkOut,
      guestsCount,
    });

    const saved = await reservation.save();
    return res.status(201).json(saved);
  }

  // ============================
  //      HOTEL RESERVATION
  // ============================

  const hotel = await HotelModel.findById(hotelId);
  if (!hotel) return res.status(404).json({ message: "Hotel not found" });

  const hotelHasRooms = hotel.rooms && hotel.rooms.length > 0;

  // ============================================================
  // CASE 1: Hotel DOES have rooms → room-level reservation
  // ============================================================
  if (hotelHasRooms) {
    if (!roomId) {
      return res.status(400).json({ message: "roomId is required for this hotel" });
    }

    const selectedRoom = hotel.rooms.id(roomId);
    if (!selectedRoom) {
      return res.status(404).json({ message: "Room not found in this hotel" });
    }

    // Count overlapping reservations for this room
    const overlapping = await Reservation.countDocuments({
      hotelId,
      roomId,
      status: { $ne: "cancelled" },
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) },
    });

    if (overlapping >= selectedRoom.quantity) {
      return res.status(400).json({
        message: "This room is fully booked for the selected dates",
      });
    }

    const nights =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

    const totalPrice = nights * selectedRoom.price;

    const reservation = new Reservation({
      guestId,
      hotelId,
      roomId,
      totalPrice,
      checkIn,
      checkOut,
      guestsCount,
    });

    const saved = await reservation.save();
    return res.status(201).json(saved);
  }

  // ============================================================
  // CASE 2: Hotel does NOT have rooms → full-hotel booking
  // ============================================================

  // Check if dates overlap with any ACTIVE reservation
  const conflict = await Reservation.findOne({
    hotelId,
    status: { $ne: "cancelled" },
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) },
  });

  if (conflict) {
    return res.status(400).json({
      message: "This hotel is already reserved for the selected dates.",
    });
  }

  const nights =
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

  const totalPrice = nights * hotel.price;

  const reservation = new Reservation({
    guestId,
    hotelId,
    totalPrice,
    checkIn,
    checkOut,
    guestsCount,
  });

  const saved = await reservation.save();
  return res.status(201).json(saved);
});


export const getAllReservations = asyncHandler(async (req, res) => {

    // const hotelIds = hostHotels.map(h => h._id);
  // const experienceIds = hostExperiences.map(e => e._id);
  const reservations = await Reservation.find(
  //   {
  //   $or: [
  //     { hotelId: { $in: hotelIds } },
  //     { experienceId: { $in: experienceIds } },
  //   ],
  // }
)
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

export const getHostReservations = asyncHandler(async (req, res) => {
  const hostId = req.user._id;
  const hostHotels = await HotelModel.find({ hostId }).select("_id");
  const hostExperiences = await ExperienceModel.find({ hostId }).select("_id");
  
    const hotelIds = hostHotels.map(h => h._id);
  const experienceIds = hostExperiences.map(e => e._id);
  const reservations = await Reservation.find({
    $or: [
      { hotelId: { $in: hotelIds } },
      { experienceId: { $in: experienceIds } },
    ],
  })
    .populate("guestId", "name email")
    .populate("hotelId", "name price")
    .populate("experienceId", "name price");
  res.status(200).json(reservations);
});

export const getReservationByhotelOrExperienceId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const reservations = await Reservation.find({
    $or: [{ hotelId: id }, { experienceId: id }],guestId: userId
  })
    .populate("guestId", "name email")
    .populate("hotelId", "name price")
    .populate("experienceId", "name price");
  res.status(200).json(reservations);
})
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

export const getReservationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const reservation = await Reservation.findById(id)
    .populate("guestId")
    .populate("hotelId")
    .populate("experienceId");
  res.status(200).json(reservation);
});
