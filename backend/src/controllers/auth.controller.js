import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';

const signup = async (req, res) => {
    const { email, fullname, password } = req.body;
    try {
        if (!email || !fullname || !password) {
            return res.status(400).json({ message: "Please provide all required fields" })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" })
        }

        // check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }

        // hash password
        const salt = await bcrypt.genSalt(10)  //genSalt and hash are asynchronous functions, they are pre defined in bcryptjs
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            email,
            fullname,
            password: hashedPassword
        })

        await newUser.save()

        if (newUser) {
            // generate token and set cookie
            generateToken(newUser._id, res)

            return res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                profilePic: newUser.profilePic,
                createdAt: newUser.createdAt,
            })

        }
        return res.status(400).json({ message: "Invalid user data" })
    } catch (error) {
        console.error("errot in signup controller", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
};

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalide email or password" })
        }

        const isPassWordMatch = await bcrypt.compare(password, user.password)
        if (!isPassWordMatch) {
            return res.status(400).json({ message: "Invalide email or password" })
        }

        generateToken(user._id, res)
        return res.status(200).json({
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
        })

    } catch (error) {
        console.error("error in login controller", error.message)
        res.status(500).json({ message: "Internal server error" })
    }

}

const logout = (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 }); // set cookie to expire immediately
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.error("error in logout controller", error.message)
        res.status(500).json({ message: "Internal server error" })
    }

};

const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        const updateResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: updateResponse.secure_url },
            { new: true }
        )

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("error in update profile controller", error.message)
        res.status(500).json({ message: "Internal server error" });
    }

}

const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("error in check auth controller", error.message)
        res.status(500).json({ message: "Internal server error" });
    }
}

export { signup, login, logout, updateProfile, checkAuth };

