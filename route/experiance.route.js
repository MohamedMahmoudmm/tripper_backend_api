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
        import  upload  from "../middlewares/experianceUpload.js";

router.get("/",auth, getAllExperiences);

router.get("/host",auth,host, getExperiencesByHost);
router.get("/search",auth, searchExperiences);

router.get("/:id",auth, getExperienceById);

router.post("/",auth,host,upload.array("images",5), createExperience);
router.put("/:id",auth,host, updateExperience);
router.delete("/:id",auth,host, deleteExperience);

router.post("/:id/activities",auth,host,upload.single("image"), addActivity);
router.delete("/:id/activities/:activityId",auth,host, removeActivity);

router.post("/:id/dates",auth,host, addDate);
router.delete("/:id/dates",auth,host, removeDate);




export default router;