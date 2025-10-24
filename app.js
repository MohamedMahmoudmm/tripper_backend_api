import express from "express";
import { dbConnection } from "./dbConnection.js";
import userRouter from "./route/user.route.js";
import hotelRouter from "./route/hotel.route.js";
import experianceRouter from "./route/experiance.route.js";
import reservationRouter from "./route/reservaiton.route.js";

const app = express();
app.use(express.json());
export default app;
dbConnection;
app.use('/user',userRouter)
app.use('/hotel',hotelRouter)
app.use('/experiance',experianceRouter)
app.use("/api/reservations", reservationRouter);



