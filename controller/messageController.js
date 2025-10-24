import MessageModel from "../models/message_model.js";


const sendMessage=async(req,res)=>{

    try {
         const newMessage=new MessageModel({senderid:req.user._id,conversationid:req.body.conversationid,content:req.body.content})
        await newMessage.save()
    res.status(201).json({status:"success",message:"message sent",data:{newMessage}})
    } catch (error) {
        res.status(500).json({status:"error",message:"something went wrong"})
    }
   
}

const getMessages=async(req,res)=>{
    try {
        const messages=await MessageModel.find({conversationid:req.params.id})
        res.status(200).json({status:"success",message:"messages found",data:{messages}})
    } catch (error) {
        res.status(500).json({status:"error",message:"something went wrong"})
    }
    
}

export {sendMessage,getMessages}