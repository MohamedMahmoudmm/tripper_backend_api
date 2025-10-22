import mongoose from "mongoose";

const placeSchema = mongoose.Schema({
    name: {type: String,required: true},
    description: String,
    images: [String],
    address: {
        country: {type: String,required: true},
        city: {type:String, required: true},
        latitude: {type: Number},
        longitude: {type: Number}
    },
    starRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
        },
    
}, {timestamps: true});

export default mongoose.model("Place", placeSchema);