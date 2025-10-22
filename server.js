import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js"


// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))












app.listen(4000, () => console.log("Server running on port 4000"));