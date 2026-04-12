import express from "express";
import { addNewPost, getAllPosts, getUserPost, likePost, addComment, getCommentOfPost, deleteComment, deletePost } from "../controller/postController.js";
import isAuthenticate from "../middlewares/isAuthenticate.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/create").post(isAuthenticate, upload.single("image"), addNewPost);
router.route("/posts").get(isAuthenticate, getAllPosts);
router.route("/myposts").get(isAuthenticate, getUserPost);
router.route("/:id").put(isAuthenticate, likePost);
router.route("/:id/comment").post(isAuthenticate, addComment);
router.route("/:id/comments").get(isAuthenticate, getCommentOfPost);
router.route("/:id").delete(isAuthenticate, deleteComment);
router.route("/post/:id").delete(isAuthenticate, deletePost);


export default router;
