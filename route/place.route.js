import express from "express";
import { auth } from "../middlewares/is_Auth.js";
import { admin } from "../middlewares/is_Admin.js";
import {
  createPlace,
  getAllPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
} from "../controller/place.controller.js";

const router = express.Router();

// Protected routes (need token)
router.post("/", auth,admin, createPlace);
router.put("/:id", auth,admin, updatePlace);
router.delete("/:id", auth,admin, deletePlace);

// Public routes
router.get("/", getAllPlaces);
router.get("/:id", getPlaceById);

export default router;
