import ConversaionModel from "../models/conversation_model.js";
import UserModel from "../models/user_model.js";
const startConversation=async(req,res)=>{

    try {

        if(!req.body.receiverid) return res.status(400).json({status:"error",message:"receiver id is required",data:null})
        const receiver=await UserModel.findById(req.body.receiverid[0])
        if(!receiver) return res.status(404).json({status:"error",message:"user not found",data:null})
            const user=await UserModel.findById(req.user._id)
            if(!user) return res.status(404).json({status:"error",message:"user not found",data:null})
        const conversation=await ConversaionModel.findOne({members:{$all:[req.user._id,...req.body.receiverid]}}).populate('members')
        if(conversation) return res.status(200).json({status:"success",message:"conversation already exist",data:{conversation}})

    const newConversaion=new ConversaionModel({members:[req.user._id,...req.body.receiverid]})
    await newConversaion.save()
    res.status(201).json({status:"success",message:"conversation started",data:{conversation:newConversaion}})
    } catch (error) {
        res.status(500).json({status:"error",message:"something went wrong",data:null})
    }
    
}

const getConversation=async(req,res)=>{
    //
    const conversations=await ConversaionModel.find({members:{$in:[req.user._id]}}).populate('members')
    res.status(200).json({status:"success",message:"conversation found",data:{conversations}})

}

const getOneConversation=async(req,res)=>{
    try{
        const conversation=await ConversaionModel.findOne({members:{$all:[req.user._id,req.params.id]}}).populate('members')
        if(!conversation) return res.status(404).json({status:"fail",message:"conversation not found",data:null})
    res.status(200).json({status:"success",message:"conversation found",data:{conversation}})

    }catch(error){
        res.status(500).json({status:"error",message:"something went wrong",data:null})
    }
    
}

const getConversationById=async(req,res)=>{
    try {
        const conversation=await ConversaionModel.findById(req.params.id).populate('members')
        if(!conversation) return res.status(404).json({status:"fail",message:"conversation not found",data:null})
        res.status(200).json({status:"success",message:"conversation found",data:{conversation}})
        
    } catch (error) {
        res.status(500).json({status:"error",message:"something went wrong",data:null})
    }

}


export {startConversation,getConversation,getOneConversation,getConversationById}