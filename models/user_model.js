import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{type: String, required: true, minlength:3, maxlength:20},
    email:{type: String,required: true,unique:true},
    password:{type: String,required: true,minlength:8},
    image:{type: String},
    phone:{type: String,required: true},
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
        type:String,
        enum:["notVerified","verified","pending","rejected"],
        default:"notVerified"
    },
},
{timestamps: true,versionKey: false}
)

const User = mongoose.model("User", userSchema);

export default User