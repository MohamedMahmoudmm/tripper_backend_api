import ExperienceModel from "../models/experiance_model.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import mongoose from "mongoose";

// Get all experiences
const getAllExperiences = asyncHandler(async (req, res) => {
    const experiences = await ExperienceModel.find();
    res.status(200).json(experiences);
});

// Get experience by ID
const getExperienceById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid experience ID" });
    }

    const experience = await ExperienceModel.findById(id).populate('hostId', 'name email image');
    
    if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
    }

    res.status(200).json(experience);
});

// Create new experience
const createExperience = asyncHandler(async (req, res) => {
    let {
        name,
        description,
        price,
        dates,
        activities,
        address,
    } = req.body;

    // Validate required fields
    if (!name || !price || !address?.country || !address?.city) {
        return res.status(400).json({ 
            message: "Name, price, country, and city are required" 
        });
    }
    dates = dates ? JSON.parse(dates) : [];

    // Validate activities structure if provided
    if (activities && Array.isArray(activities)) {
        for (let activity of activities) {
            if (!activity.title) {
                return res.status(400).json({ 
                    message: "Each activity must have a title" 
                });
            }
        }
    }
    const images = req.files.map(file => file.path);

    const newExperience = new ExperienceModel({
        hostId: req.user._id,
        name,
        description,
        images: images || [],
        price,
        dates: dates || [],
        activities: activities || [],
        address,
    });

    const savedExperience = await newExperience.save();
    await savedExperience.populate('hostId', 'name email');
    res.status(201).json(savedExperience);
});

// Update experience
const updateExperience = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid experience ID" });
    }

    // Prevent updating hostId if provided
    if (updateData.hostId) {
        delete updateData.hostId;
    }

    // Validate activities structure if provided in update
    if (updateData.activities && Array.isArray(updateData.activities)) {
        for (let activity of updateData.activities) {
            if (!activity.title) {
                return res.status(400).json({ 
                    message: "Each activity must have a title" 
                });
            }
        }
    }

    const updatedExperience = await ExperienceModel.findOneAndUpdate(
        {   _id: id , hostId: req.user._id },
        { $set: updateData },
        { new: true, runValidators: true }
    ).populate('hostId', 'name email');

    if (!updatedExperience) {
        return res.status(404).json({ message: "Experience not found" });
    }

    res.status(200).json(updatedExperience);
});

// Delete experience
const deleteExperience = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid experience ID" });
  }

  const deletedExperience = await ExperienceModel.findByIdAndDelete(id).populate('hostId', 'name email');

  if (!deletedExperience) {
    return res.status(404).json({ message: "Experience not found" });
  }

  res.status(200).json({ 
    message: "Experience deleted successfully",
    deletedExperience 
  });
});

// Get experiences by host
const getExperiencesByHost = asyncHandler(async (req, res) => {
    const  hostId  = req.user._id;

    console.log("ffffffffffffff");
    
    if (!mongoose.Types.ObjectId.isValid(hostId)) {
        return res.status(400).json({ message: "Invalid host ID" });
    }

    const experiences = await ExperienceModel.find({ hostId });
    res.status(200).json(experiences);
});

// Search experiences with filters
const searchExperiences = asyncHandler(async (req, res) => {
    const {
        city,
        country,
        minPrice,
        maxPrice,
        minRating,
        date,
        activity
    } = req.query;

    let filter = {};

    // Location filters
    if (city) filter['address.city'] = new RegExp(city, 'i');
    if (country) filter['address.country'] = new RegExp(country, 'i');

    // Price range filter
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) {
        filter.starRating = { $gte: Number(minRating) };
    }

    // Date filter - find experiences that have the specified date
    if (date) {
        const targetDate = new Date(date);
        filter.dates = { $elemMatch: { $eq: targetDate } };
    }

    // Activity filter - find experiences that have activities containing the search term
    if (activity) {
        filter['activities.title'] = new RegExp(activity, 'i');
    }

    const experiences = await ExperienceModel.find(filter).populate('hostId', 'name email');
    res.status(200).json(experiences);
});

// Add activity to experience
const addActivity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid experience ID" });
    }

    if (!title) {
        return res.status(400).json({ message: "Activity title is required" });
    }
    const image = req.file ? req.file.path : null;

    const experience = await ExperienceModel.findByIdAndUpdate(
        { _id: id, hostId: req.user._id },
        { 
            $push: { 
                activities: { title, description, image } 
            } 
        },
        { new: true, runValidators: true }
    ).populate('hostId', 'name email');

    if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
    }

    res.status(200).json(experience);
});

// Remove activity from experience
const removeActivity = asyncHandler(async (req, res) => {
    const { id, activityId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid experience ID" });
    }

    const experience = await ExperienceModel.findByIdAndUpdate(
        id,
        { 
            $pull: { 
                activities: { _id: activityId } 
            } 
        },
        { new: true, runValidators: true }
    ).populate('hostId', 'name email');

    if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
    }

    res.status(200).json(experience);
});

// Add date to experience
const addDate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid experience ID" });
    }

    if (!date) {
        return res.status(400).json({ message: "Date is required" });
    }

    const experience = await ExperienceModel.findByIdAndUpdate(
        { _id: id, hostId: req.user._id },
        { 
            $addToSet: { 
                dates: new Date(date) 
            } 
        },
        { new: true, runValidators: true }
    ).populate('hostId', 'name email');

    if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
    }

    res.status(200).json(experience);
});

// Remove date from experience
const removeDate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid experience ID" });
    }

    if (!date) {
        return res.status(400).json({ message: "Date is required" });
    }

    const experience = await ExperienceModel.findByIdAndUpdate(
        id,
        { 
            $pull: { 
                dates: new Date(date) 
            } 
        },
        { new: true, runValidators: true }
    ).populate('hostId', 'name email');

    if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
    }

    res.status(200).json(experience);
});

// Add images to experience
const addExperienceImages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid experience ID" });
  }
  const experience = await ExperienceModel.findOne({
    _id: id,
    hostId: req.user._id
  });

  if (!experience) {
    return res.status(404).json({ message: "Experience not found" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No images uploaded" });
  }
  const newImages = req.files.map((file) => file.path);

  experience.images = [...experience.images, ...newImages];
  await experience.save();

  res.status(200).json({
    message: "Images added successfully",
    images: experience.images
  });
});



export {
    getAllExperiences,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience,
    getExperiencesByHost,
    searchExperiences,
    addActivity,
    removeActivity,
    addDate,
    removeDate,
    addExperienceImages
};