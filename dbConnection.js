import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

export const dbConnection = mongoose.connect(process.env.MONGO_URI, {
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
