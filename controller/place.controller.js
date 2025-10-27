import Place from "../models/place_model.js";
import { asyncHandler } from "../middlewares/errorHandler.js";



export const createPlace = asyncHandler(async (req, res) => {
const {name,description,address} = req.body;
    const images = req.files.map(file => file.path);
   const ExistPlace = await Place.findOne({name});
    if(ExistPlace){
        res.status(400).json("Place with this name already exists");
    }
     const newPlace = new Place({
       name,
        description,
         images: images || [],
        address,
     })
     const savedPlace = await newPlace.save();
      res.status(201).json(savedPlace);
});

export const getAllPlaces = asyncHandler(async (req, res) => {
  const { search, city } = req.query;
  let query = {};

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
