import express from "express";
const router = express.Router();
import { getAllHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel,
    getHotelsByHost,
    searchHotels } from "../controller/hotel.controller.js";

router.get("/", getAllHotels);
router.get("/:id", getHotelById);
router.post("/", createHotel);
router.put("/:id", updateHotel);
router.delete("/:id", deleteHotel);
router.get("/host/:hostId", getHotelsByHost);
router.get("/search", searchHotels);


export default router;