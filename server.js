import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js"
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors'

const server = createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
console.log('Socket connected');


  socket.on("user-online", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online on socket ${socket.id}`);
    

  });
  socket.on("send-message", (payload) => {
    console.log(
      `Message sent from  to ${payload.recipientId}: ${payload.text}`
    );
    
    // payload: {recipientId, text }
    const { recipientId,text } = payload; // if private chat, include recipientId
    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive-message", text);
    }
  });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      
        onlineUsers.forEach((socketId, userId) => {
            if (socket.id === socketId) {
              onlineUsers.delete(userId);
            }
          });
       

    });
    
})

// Start server
const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

