import express from "express";
const router = express.Router();
import { getAllHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel,
    getHotelsByHost,
    searchHotels } from "../controller/hotel.controller.js";

    import { auth } from "../middlewares/is_Auth.js";
    import { host } from "../middlewares/is_Host.js";

router.get("/",auth, getAllHotels);
router.get("/:id",auth, getHotelById);
router.post("/",auth, host, createHotel);
router.put("/:id",auth,host, updateHotel);
router.delete("/:id",auth,host, deleteHotel);
router.get("/host",auth,host, getHotelsByHost);
router.get("/search", searchHotels);


export default router;