import Place from "../models/place_model.js";
import { asyncHandler } from "../middlewares/errorHandler.js";


// 🟢 Create new place (Admin only)
export const createPlace = asyncHandler(async (req, res) => {
  const newPlace = new Place(req.body);
  await newPlace.save();

  res.status(201).json({
    message: "Place created successfully by admin",
    data: newPlace,
  });
});

// 🟡 Get all places (Anyone can view)
export const getAllPlaces = asyncHandler(async (req, res) => {
  const { search, city } = req.query;
  let query = {};

  // 🧩 Search (by name or description or country)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { "address.country": { $regex: search, $options: "i" } },
    ];
  }

  // 🏙️ Filter by city
  if (city) {
    query["address.city"] = { $regex: city, $options: "i" };
  }

  const places = await Place.find(query);

  res.status(200).json({
    count: places.length,
    data: places,
  });
});

// 🟣 Get single place by ID (Anyone can view)
export const getPlaceById = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    res.status(404);
    throw new Error("Place not found");
  }

  res.status(200).json({ data: place });
});

// 🟠 Update place (Admin only)
export const updatePlace = asyncHandler(async (req, res) => {
  const updatedPlace = await Place.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updatedPlace) {
    res.status(404);
    throw new Error("Place not found");
  }

  res.status(200).json({
    message: "Place updated successfully by admin",
    data: updatedPlace,
  });
});

// 🔴 Delete place (Admin only)
export const deletePlace = asyncHandler(async (req, res) => {
  const deletedPlace = await Place.findByIdAndDelete(req.params.id);

  if (!deletedPlace) {
    res.status(404);
    throw new Error("Place not found");
  }

  res.status(200).json({ message: "Place deleted successfully by admin" });
});
