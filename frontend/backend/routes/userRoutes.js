import express from "express";
import {register, login, logout, getProfile, editProfile,myProfile} from "../controller/userController.js"
import isAuthenticated from "../middlewares/isAuthenticate.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);

router.route('/me').get(isAuthenticated,myProfile);
router.route('/:id').get(getProfile);

router.route('/me').put(isAuthenticated,upload.single("profilePicture"), editProfile);

export default router;
