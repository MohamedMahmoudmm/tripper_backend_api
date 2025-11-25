import Favorite from "../models/favorite_model.js";
import Hotel from "../models/hotel_model.js";
import Experiance from "../models/experiance_model.js";
import Place from "../models/place_model.js";

export const addFavorite = async (req, res) => {
    try {
        const { itemId, itemType } = req.body;
        const userId = req.user._id;

        if (!['Hotel', 'Experiance', 'Place'].includes(itemType)) {
            return res.status(400).json({ message: "Invalid item type" });
        }

        let item;
        if (itemType === 'Hotel') {
            item = await Hotel.findById(itemId);
        } else if (itemType === 'Experiance') {
            item = await Experiance.findById(itemId);
        } else if (itemType === 'Place') {
            item = await Place.findById(itemId);
        }

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        const existingFavorite = await Favorite.findOne({ userId, itemId, itemType });
        if (existingFavorite) {
            return res.status(400).json({ message: "Already in favorites" });
        }

        const favorite = new Favorite({ userId, itemId, itemType });
        await favorite.save();

        res.status(201).json({ 
            message: "Added to favorites successfully",
            favorite 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        const { itemId, itemType } = req.body;
        const userId = req.user._id;

        const favorite = await Favorite.findOneAndDelete({ 
            userId, 
            itemId, 
            itemType 
        });

        if (!favorite) {
            return res.status(404).json({ message: "Favorite not found" });
        }

        res.status(200).json({ 
            message: "Removed from favorites successfully" 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUserFavorites = async (req, res) => {
    try {
        const userId = req.user._id;

        const favorites = await Favorite.find({ userId })
            .populate({
                path: 'itemId',
                select: 'name images price starRating address'
            })
            .sort({ createdAt: -1 });

        const formattedFavorites = favorites.map(fav => ({
            id: fav.itemId._id,
            title: fav.itemId.name,
            image: fav.itemId.images && fav.itemId.images.length > 0 
                ? fav.itemId.images[0] 
                : '',
            price: fav.itemId.price,
            rating: fav.itemId.starRating,
            model: fav.itemType.toLowerCase(),
            favoriteId: fav._id
        }));

        res.status(200).json({ 
            favorites: formattedFavorites 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const checkFavorite = async (req, res) => {
    try {
        const { itemId, itemType } = req.query;
        const userId = req.user._id;

        const favorite = await Favorite.findOne({ userId, itemId, itemType });

        res.status(200).json({ 
            isFavorite: !!favorite 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};