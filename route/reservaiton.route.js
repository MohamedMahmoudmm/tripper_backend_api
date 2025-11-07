import express from "express";
import {
    createReservation,
    getAllReservations,
    getUserReservations,
    updateReservationStatus,
    filterReservationsByStatus,
    getReservationById
} from "../controller/reservation.controller.js";
import { auth} from "../middlewares/is_Auth.js";
import { host } from "../middlewares/is_Host.js";
import { get } from "mongoose";
const router = express.Router();

router.post("/", auth, createReservation);
router.get("/", auth, host, getAllReservations);
router.get("/my", auth, getUserReservations);
router.patch("/:id/status", auth, host, updateReservationStatus);
router.get("/filter", auth, host, filterReservationsByStatus);
router.get("/:id", auth, host, getReservationById);

export default router;
