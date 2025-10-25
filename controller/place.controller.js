import Place from "../models/place_model.js";

// 🟢 Create new place (Admin only)
export const createPlace = async (req, res) => {
  try {
    // ✅ تحقق من role
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only admin can create places." });
    }

    const newPlace = new Place(req.body);
    await newPlace.save();

    res.status(201).json({
      message: "Place created successfully by admin",
      data: newPlace,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🟡 Get all places (Anyone can view)
// 🟡 Get all places (Anyone can view)
export const getAllPlaces = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟣 Get single place by ID (Anyone can view)
export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.status(200).json({ data: place });
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
};

// 🟠 Update place (Admin only)
export const updatePlace = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only admin can update places." });
    }

    const updatedPlace = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedPlace)
      return res.status(404).json({ message: "Place not found" });

    res.status(200).json({
      message: "Place updated successfully by admin",
      data: updatedPlace,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔴 Delete place (Admin only)
export const deletePlace = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only admin can delete places." });
    }

    const deletedPlace = await Place.findByIdAndDelete(req.params.id);
    if (!deletedPlace)
      return res.status(404).json({ message: "Place not found" });

    res.status(200).json({ message: "Place deleted successfully by admin" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
