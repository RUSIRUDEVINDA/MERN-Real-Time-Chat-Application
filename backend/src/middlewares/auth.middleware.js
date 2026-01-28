import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt // get token from cookies

        if (!token) {
            return res.status(401).json({ message: "Unauthorized access, token missing" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized access, invalid token" })
        }

        const user = await User.findById(decoded.userId).select('-password')

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access, user not found" })
        }

        req.user = user // attach user to request object
        next(); // proceed to next middleware or route handler

    } catch (error) {
        console.error("Error in auth middleware:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}