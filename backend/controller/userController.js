import jwt from "jsonwebtoken";
import { User } from "../models/User.js"
import bcrypt from "bcryptjs"
import getDataURI from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js"

export const register = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        // normalize data
        username = username.trim();
        email = email.toLowerCase();

        // validations
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
                success: false,
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
                success: false,
            });
        }

        // check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists, please login",
                success: false,
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // generate jwt token
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        // set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });

        // success response
        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            data: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("Register Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        email = email.toLowerCase();

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false,
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false,
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const { password: _, ...userWithoutPass } = user._doc;

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }).status(200).json({
            message: "Login successful",
            success: true,
            data: userWithoutPass,
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res
            .clearCookie("token", {
                httpOnly: true,
                sameSite: "strict",
            })
            .status(200)
            .json({
                message: "User logged out successfully",
                success: true,
            });

    } catch (error) {
        console.log("Logout Error:", error);

        return res.status(500).json({
            message: "Internal server error", error,
            success: false,
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .populate("followers", "username profilePicture")
            .populate("following", "username profilePicture")
            .populate({
                path: "posts",
                options: { sort: { createdAt: -1 } }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { password, ...safeUser } = user._doc;

        res.status(200).json({
            success: true,
            user: safeUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const myProfile = async (req, res) => {
    try {
        const id = req.id;

        const user = await User.findById(id)
            .populate({
                path: "posts",
                select: "image caption createdAt",
                options: { sort: { createdAt: -1 } } // newest first
            })
            .populate("followers", "username profilePicture")
            .populate("following", "username profilePicture");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // remove password
        const { password, ...userWithoutPass } = user._doc;

        return res.status(200).json({
            success: true,
            data: userWithoutPass,
        });

    } catch (error) {
        console.error("Get Profile Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const editProfile = async (req, res) => {
    try {
        const { gender, bio } = req.body;
        const userId = req.id;

        const profilePicture = req.file;

        let cloudResponse;
        if (profilePicture) {
            const fileUri = getDataURI(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // update fields
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;

        if (profilePicture && cloudResponse) {
            user.profilePicture = cloudResponse.secure_url;
        }

        await user.save();

        // remove password
        const { password, ...userWithoutPass } = user._doc;

        return res.status(200).json({
            message: "User profile updated",
            success: true,
            data: userWithoutPass,
        });

    } catch (error) {
        console.error("Edit Profile Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const followUser = async (req, res) => {
    try {
        const userId = req.id;        // logged-in user
        const targetId = req.params.id;    // user to follow
        console.log(userId, targetId);


        if (userId === targetId) {
            return res.status(400).json({ message: "You can't follow yourself" });
        }

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetId);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // already following check
        if (user.following.includes(targetId)) {
            return res.status(400).json({ message: "Already following" });
        }

        user.following.push(targetId);
        targetUser.followers.push(userId);

        await user.save();
        await targetUser.save();

        const updatedUser = await User.findById(userId)
            .populate("following", "username profilePicture")
            .populate("followers", "username profilePicture");

        res.status(200).json({
            message: "Followed successfully",
            user: updatedUser,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const unfollowUser = async (req, res) => {
    try {
        const userId = req.id;        // logged-in user
        const targetId = req.params.id;    // user to follow
        console.log(userId, targetId);


        if (userId === targetId) {
            return res.status(400).json({ message: "You can't unfollow yourself" });
        }

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetId);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        user.following = user.following.filter(
            (id) => id.toString() !== targetId
        );

        targetUser.followers = targetUser.followers.filter(
            (id) => id.toString() !== userId
        );

        await user.save();
        await targetUser.save();

        const updatedUser = await User.findById(userId)
            .populate("following", "username profilePicture")
            .populate("followers", "username profilePicture");

        res.status(200).json({
            message: "Unfollowed successfully",
            user: updatedUser,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const query = req.query.query;

        const users = await User.find({
            username: {
                $regex: query,
                $options: "i",
            },
        })
            .select("username profilePicture bio")
            .limit(20);

        return res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/////
export const getSuggestedUsers = async (
    req,
    res
) => {
    try {
        const userId = req.id;

        const currentUser =
            await User.findById(userId);

        const suggestedUsers =
            await User.find({
                _id: {
                    $nin: [
                        ...currentUser.following,
                        userId,
                    ],
                },
            })
                .select(
                    "username profilePicture bio"
                )
                .limit(5);

        return res.status(200).json({
            success: true,
            users: suggestedUsers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};