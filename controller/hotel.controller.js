import HotelModel from "../models/hotel_model.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import mongoose from "mongoose";

// Get all hotels
const getAllHotels = asyncHandler(async (req, res) => {
    const hotels = await HotelModel.find();
    res.status(200).json(hotels);
});

// Get hotel by ID
const getHotelById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid hotel ID" });
    }

    const hotel = await HotelModel.findById(id).populate('hostId', 'name email image');
    
    if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(hotel);
});

// Create new hotel
const createHotel = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        amenities,
        address,

    } = req.body;

    // Validate required fields
    if (!name || !price || !address?.country || !address?.city || !address?.street) {
        return res.status(400).json({ 
            message: "Name, price, and complete address (country, city, street) are required" 
        });
    }
    const images = req.files.map(file => file.path);

    const newHotel = new HotelModel({
        hostId: req.user._id,
        name,
        description,
        images: images || [],
        price,
        amenities: amenities || [],
        address,
    });

    const savedHotel = await newHotel.save();
    res.status(201).json(savedHotel);
});

// Update hotel
const updateHotel = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    console.log( req.user._id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid hotel ID" });
    }

    // Prevent updating hostId if provided
    // if (updateData.hostId) {
    //     delete updateData.hostId;
    // }

    const updatedHotel = await HotelModel.findOneAndUpdate(
        { _id: id , hostId: req.user._id },
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedHotel) {
        return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(updatedHotel);
});

// Delete hotel
const deleteHotel = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid hotel ID" });
    }

    const deletedHotel = await HotelModel.findOneAndDelete({
        _id: id,
        hostId: req.user._id
    });

    if (!deletedHotel) {
        return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json({ 
        message: "Hotel deleted successfully",
        deletedHotel 
    });
});

// Get hotels by host
const getHotelsByHost = asyncHandler(async (req, res) => {
    const  hostId  = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(hostId)) {
        return res.status(400).json({ message: "Invalid host ID" });
    }

    const hotels = await HotelModel.find({ hostId });
    res.status(200).json(hotels);
});

// Search hotels with filters
const searchHotels = asyncHandler(async (req, res) => {
    const {
        city,
        country,
        minPrice,
        maxPrice,
        minRating,
        amenities
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

    // Amenities filter
    if (amenities) {
        const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
        filter.amenities = { $in: amenitiesArray };
    }

    const hotels = await HotelModel.find(filter);
    res.status(200).json(hotels);
});

export {
    getAllHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel,
    getHotelsByHost,
    searchHotels
};