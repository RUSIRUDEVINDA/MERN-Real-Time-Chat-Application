import express from 'express'
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js';
import cookieParser from "cookie-parser";
import { protectRoute } from './middlewares/auth.middleware.js';
import { connectDB } from './lib/db.js';
import cors from 'cors';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5001

// Middleware to parse JSON request bodies
app.use(express.json({ limit: "5mb" }));

// Middleware to parse cookies
app.use(cookieParser());

// Enable CORS
app.use(cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // allow cookies to be sent
}));


// auth routes
app.use("/api/auth", authRoutes)
// message routes
app.use("/api/message", messageRoutes)

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    connectDB()
})