import express from "express";
import mongoose from 'mongoose';
const app = express();


mongoose.connect('mongodb+srv://mm4574:mm4574@cluster0.xq5ja.mongodb.net/tripperDB').then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
})













app.listen(4000, () => console.log("Server running on port 4000"));