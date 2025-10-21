import mongoose from "mongoose";

const MessageSchema=new mongoose.Schema({
    senderid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    conversationid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Conversation',
        required:true
    },
    content:{
        type:String,
        required:true
    }
    
    
},{timestamps:true})
const Message=mongoose.model('Message',MessageSchema)
export default Message