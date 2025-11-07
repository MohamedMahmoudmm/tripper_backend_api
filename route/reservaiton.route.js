import express from "express";
import {
    createReservation,
    getAllReservations,
    getUserReservations,
    updateReservationStatus,
    filterReservationsByStatus,
} from "../controller/reservation.controller.js";
import { auth} from "../middlewares/is_Auth.js";
const router = express.Router();
router.post("/", auth, createReservation);
router.get("/", auth, getAllReservations);
router.get("/my", auth, getUserReservations);
router.patch("/:id/status", auth, updateReservationStatus);
router.get("/filter", auth, filterReservationsByStatus);

export default router;
