import mongoose from "mongoose";

const hotelSchema = mongoose.Schema({
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: {type: String,required: true},
    description: String,
    images: [{type:String}],
    price: {type: Number,required: true},
    amenities: [String],
    address: {
        country: {type: String,required: true},
        city: {type:String, required: true},
        street: {type: String, required: true},
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

export default mongoose.model("Hotel", hotelSchema);