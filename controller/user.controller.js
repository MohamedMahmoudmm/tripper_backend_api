import { asyncHandler } from "../middlewares/errorHandler.js";
import User from "../models/user_model.js";
import bcrypt from "bcrypt"

export const signup = asyncHandler(async(req, res) => {
req.body.password = await bcrypt.hash(req.body.password, 8);
    let newUser = await User.insertMany(req.body)
     newUser[0].password = undefined
    res.status(201).json({ message: "User created successfully", data: newUser});
})

// export const signin = asyncHandler(async(req,res)=>{

// })


// export const logout = asyncHandler(async(req,res)=>{

// })


// export const switchRole = asyncHandler(async(req,res)=>{

// })


// export const verifyAccount = asyncHandler(async(req,res)=>{

// })


// export const confirmAccount = asyncHandler(async(req,res)=>{

// })

// export const getUserProfile = asyncHandler(async(req,res)=>{

// })