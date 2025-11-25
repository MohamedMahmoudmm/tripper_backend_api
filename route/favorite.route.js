import express from "express";
import { 
    addFavorite, 
    removeFavorite, 
    getUserFavorites,
    checkFavorite 
} from "../controller/favorite.controller.js";
import { auth } from "../middlewares/is_Auth.js";

const favoriteRouter = express.Router();

favoriteRouter.post("/", auth, addFavorite);
favoriteRouter.delete("/", auth, removeFavorite);
favoriteRouter.get("/", auth, getUserFavorites);
favoriteRouter.get("/check", auth, checkFavorite);

export default favoriteRouter;