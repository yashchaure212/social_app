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

        return res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
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
        console.error("Logout Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

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

export const myProfile = async (req, res) => {
    try {
        const id = req.id;

        const user = await User.findById(id);

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

/////
export const suggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            res.status(404).json({
                message: "currenty you dont have user suggestion",
                success: false,
            })
        };

        res.status(200).json({
                suggestedUsers,
                success: false,
            })
    } catch (error) {
        res.status(404).json({
            message: error.message,
            success: false,
        })
    }
}
