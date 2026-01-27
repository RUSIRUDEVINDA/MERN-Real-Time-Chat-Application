import express from 'express'
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js'
import cookieParser from "cookie-parser";
import { protectRoute } from './middlewares/auth.middleware.js';
import { connectDB } from './lib/db.js';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5001

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// auth routes
app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    connectDB()
})