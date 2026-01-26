import express from 'express'
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js'
import { connectDB } from './lib/db.js';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5001

app.use("/api/auth", authRoutes)

app.use(express.json()) // Middleware to parse JSON request bodies

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    connectDB()
})