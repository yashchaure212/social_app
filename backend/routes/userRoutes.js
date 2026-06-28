import express from "express";
import { register, login, logout, getProfile, editProfile, myProfile, followUser, unfollowUser, searchUsers, getSuggestedUsers } from "../controller/userController.js";

import isAuthenticated from "../middlewares/isAuthenticate.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// auth
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// current user
router.get("/me", isAuthenticated, myProfile);
router.put("/me", isAuthenticated, upload.single("profilePicture"), editProfile);

router.post("/follow/:id", isAuthenticated, followUser);
router.post("/unfollow/:id", isAuthenticated, unfollowUser);

// other users profile
router.get("/profile/:id", isAuthenticated, getProfile);
router.get("/search", isAuthenticated, searchUsers);
router.get("/suggested", isAuthenticated, getSuggestedUsers);

export default router;