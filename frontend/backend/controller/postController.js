import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { Comment } from "../models/Comment.js"
import sharp from "sharp";

export const addNewPost = async (req, res) => {
    try {

        // 🔹 1. Extract data
        const authorId = req.id;
        const { caption } = req.body;
        const file = req.file;

        // 🔹 2. Validate input
        if (!authorId) {
            return res.status(401).json({
                message: "Unauthorized user",
                success: false,
            });
        }

        if (!caption || caption.trim() === "") {
            return res.status(400).json({
                message: "Caption is required",
                success: false,
            });
        }

        if (!file) {
            return res.status(400).json({
                message: "Image is required",
                success: false,
            });
        }

        // 🔹 3. Check user existence
        const user = await User.findById(authorId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }
        // 🔹 4. Optimize image using sharp
        const optimizedImage = await sharp(file.buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toFormat("jpeg", { quality: 80 })
            .toBuffer();

        // 🔹 5. Convert buffer to base64 (Data URI)
        const fileUri = `data:image/jpeg;base64,${optimizedImage.toString("base64")}`;

        // 🔹 6. Upload to Cloudinary
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        if (!cloudResponse || !cloudResponse.secure_url) {
            return res.status(500).json({
                message: "Image upload failed",
                success: false,
            });
        }

        // 🔹 7. Create post
        const post = await Post.create({
            caption: caption.trim(),
            image: cloudResponse.secure_url,
            author: authorId,
        });

        // 🔹 8. Update user posts
        user.posts.push(post._id);
        await user.save();

        // 🔹 9. Populate author (exclude password)
        await post.populate({
            path: "author",
            select: "-password",
        });

        // 🔹 10. Send response
        return res.status(201).json({
            message: "Post created successfully",
            success: true,
            post,
        });

    } catch (error) {
        console.log("ERROR:", error); // 🔥 ADD THIS

        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        // 🔹 1. Fetch posts (latest first)
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "author",
                select: "username profilePicture"
            })
            .populate({
                path: "comments",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "author",
                    select: "username profilePicture"
                },
            });

        posts.forEach((post) => {
            console.log("Author ID:", post.author);
        });

        // 🔹 3. Send success response
        return res.status(200).json({
            success: true,
            message: posts.length ? "Posts fetched successfully" : "No posts yet",
            posts,
        });

    } catch (error) {
        console.error("Get Posts Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;

        const authorPosts = await Post.find({ author: authorId })
            .sort({ createdAt: -1 })
            .populate({
                path: "author",
                select: "username profilePicture"
            })
            .populate({
                path: "comments",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "author",
                    select: "username profilePicture"
                },

            });

        res.status(200).json({
            message: "user post fetch successfully",
            success: true,
            authorPosts
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
};

export const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        // 🔹 Validate
        if (!authorId) {
            return res.status(401).json({
                message: "Unauthorized user",
                success: false,
            });
        }

        if (!postId) {
            return res.status(400).json({
                message: "Invalid post ID",
                success: false,
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        const alreadyLiked = post.likes.includes(authorId);

        if (!alreadyLiked) {
            post.likes.push(authorId);

            await post.save();

            return res.status(200).json({
                message: "Post liked",
                success: true,
                post,
            });
        } else {
            post.likes = post.likes.filter(
                (id) => id.toString() !== authorId.toString()
            );

            await post.save();

            return res.status(200).json({
                message: "Post unliked",
                success: true,
                post,
            });
        }

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
};

export const addComment = async (req, res) => {
    try {
        const authorId = req.id;
        const postId = req.params.id;
        const { text } = req.body;

        if (!authorId || !postId || !text?.trim()) {
            return res.status(400).json({
                message: "Invalid input",
                success: false,
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        const comment = await Comment.create({
            text: text.trim(),
            author: authorId,
            post: postId,
        });

        post.comments.push(comment._id);
        await post.save();

        await comment.populate({
            path: "author",
            select: "username profilePicture"
        })

        return res.status(201).json({
            message: "Comment added successfully",
            success: true,
            comment,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "internal serval error",
            success: false,
        })
    }
};

export const getCommentOfPost = async (req, res) => {
    try {
        const postId = req.params.id;

        if (!postId) {
            return res.status(400).json({
                message: "Invalid request",
                success: false,
            });
        }

        const comments = await Comment.find({ post: postId }).populate({
            path: "author",
            select: "username profilePicture"
        });

        res.status(200).json({
            message: comments.length
                ? "Comments fetched successfully"
                : "No comments yet",
            success: true,
            comments
        })


    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "internal serval error",
            success: false,
        })
    }
};

export const deleteComment = async (req, res) => {
    try {
        const authorId = req.id;
        const commentId = req.params.id;

        if (!authorId || !commentId) {
            return res.status(400).json({
                message: "invalid inputes",
                success: false,
            })
        };

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(400).json({
                message: "post not found",
                success: false,
            })
        };

        if (comment.author.toString() !== authorId.toString()) {
            return res.status(400).json({
                message: "You are not allowed to delete this comment",
                success: false,
            })
        };

        const post = await Post.findById(comment.post);
        if (post) {
            post.comments = post.comments.filter(
                (id) => id.toString() !== commentId.toString()
            );
            await post.save();
        };

        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });



    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "internal serval error",
            success: false,
        })
    }
};

export const deletePost = async (req, res) => {
    try {
        const authorId = req.id;
        const postId = req.params.id;

        if(!authorId || !postId) {
            return res.status(400).json({
                message:"invalid request",
                success: false,
            })
        };

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if(authorId.toString() !== post.author.toString()){
            return res.status(403).json({
                message:"not authorize to delete this post",
                success: false,
            })
        };

        await Comment.deleteMany({ post: postId });

        const user = await User.findById(authorId);
         if (user) {
            user.posts = user.posts.filter(
                (id) => id.toString() !== postId.toString()
            );
            await user.save();
        };

        await Post.findByIdAndDelete(postId);

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "internal serval error",
            success: false,
        })
    }
}