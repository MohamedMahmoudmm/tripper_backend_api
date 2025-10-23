import express from "express";
const router = express.Router();

import {getAllExperiences,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience,
    getExperiencesByHost,
    searchExperiences,
    addActivity,
    removeActivity,
    addDate,
    removeDate} from "../controller/experiance.controller.js";


router.get("/", getAllExperiences);
router.get("/:id", getExperienceById);
router.post("/", createExperience);
router.put("/:id", updateExperience);
router.delete("/:id", deleteExperience);
router.get("/host/:hostId", getExperiencesByHost);
router.get("/search", searchExperiences);
router.post("/:id/activities", addActivity);
router.delete("/:id/activities/:activityId", removeActivity);
router.post("/:id/dates", addDate);
router.delete("/:id/dates", removeDate);



export default router;