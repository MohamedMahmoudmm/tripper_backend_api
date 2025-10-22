import express from "express";
import { dbConnection } from "./dbConnection.js";
import userRouter from "./route/user.route.js";


const app = express();
app.use(express.json());
export default app;
dbConnection;
app.use(userRouter)


