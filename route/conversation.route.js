
import express from 'express'
const router=express.Router()
import { startConversation,getConversation,getOneConversation,getConversationById } from '../controller/conversationController.js'
import { auth } from '../middlewares/is_Auth.js'
router.post('/startConversation',auth,startConversation)
router.get('/getConversation',auth,getConversation)
router.get('/getConversation/:id',auth,getOneConversation)
router.get('/getConversationById/:id',auth,getConversationById)


export default router