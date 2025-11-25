import mongoose from "mongoose";

const favoriteSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    itemId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'itemType'
    },
    itemType: {
        type: String,
        required: true,
        enum: ['Hotel', 'Experiance', 'Place']
    }
}, { timestamps: true });

favoriteSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);
export default Favorite;