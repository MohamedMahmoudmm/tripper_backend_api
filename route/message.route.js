import express from 'express'
const router=express.Router()
import { getMessages,sendMessage } from '../controller/messageController.js'
import { auth } from '../middlewares/is_Auth.js'
router.post('/sendMessage',auth,sendMessage)
router.get('/getMessages/:id',auth,getMessages)


export default router