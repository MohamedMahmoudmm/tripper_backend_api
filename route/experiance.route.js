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

 import { auth } from "../middlewares/is_Auth.js";
    import { host } from "../middlewares/is_Host.js";

router.get("/",auth, getAllExperiences);
router.get("/:id",auth, getExperienceById);
router.post("/",auth, host, createExperience);
router.put("/:id",auth,host, updateExperience);
router.delete("/:id",auth,host, deleteExperience);
router.get("/host/:hostId",auth,host, getExperiencesByHost);
router.get("/search",auth, searchExperiences);
router.post("/:id/activities",auth,host, addActivity);
router.delete("/:id/activities/:activityId",auth,host, removeActivity);
router.post("/:id/dates",auth,host, addDate);
router.delete("/:id/dates",auth,host, removeDate);



export default router;