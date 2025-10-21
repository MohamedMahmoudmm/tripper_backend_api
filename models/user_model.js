import mongoose from "mongoose";
import { version } from "react";

const userSchema = new mongoose.Schema({
    name:{type: String, required: true, minlength:3, maxlength:20},
    email:{type: String,required: true,unique:true},
    password:{type: String,required: true,minlength:8,maxlength:12},
    image:{type: String},
    phone:{type: String,},
    identityImageUrl:{type: String},
    role:{
        type:[String],
        enum:["guest","host","admin"],
        default:["guest"]
    },
    activeRole:{
        type:String,
        enum:["guest","host","admin"],
        default:"guest"
    },
    isConfirmed:{
        type:Boolean,
        default:false
    },
    isVerified:{
        type:Boolean,
        default:false
    },
},
{timestamps: true,versionKey: false}
)

const User = mongoose.model("User", userSchema);

export default User