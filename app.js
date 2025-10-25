import express from "express";
import { dbConnection } from "./dbConnection.js";
import userRouter from "./route/user.route.js";
import hotelRouter from "./route/hotel.route.js";
import experianceRouter from "./route/experiance.route.js";
import placeRoutes from "./route/place.route.js"
import reservationRouter from "./route/reservaiton.route.js";
import messageRouter from "./route/message.route.js";
import conversationRouter from "./route/conversation.route.js";
import reviewRouter from "./route/Review.route.js";

const app = express();
app.use(express.json());
export default app;
dbConnection;
app.use('/user',userRouter)
app.use('/hotel',hotelRouter)
app.use('/experiance',experianceRouter)
app.use("/places", placeRoutes);
app.use("/api/reservations", reservationRouter);
app.use('/message',messageRouter);
app.use('/conversation',conversationRouter);
app.use('/review',reviewRouter);



