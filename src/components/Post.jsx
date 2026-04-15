import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Post = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [showHeart, setShowHeart] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };

  const [comments, setComments] = useState([
    { id: 1, user: "john", text: "Nice pic!" },
    { id: 2, user: "alex", text: "🔥🔥🔥" },
    { id: 3, user: "alex", text: "🔥🔥🔥" },
    { id: 4, user: "alex", text: "🔥🔥🔥" },
    { id: 5, user: "alex", text: "🔥🔥🔥" },
    { id: 14, user: "john", text: "Nice pic!" },
    { id: 24, user: "alex", text: "🔥🔥🔥" },
    { id: 34, user: "alex", text: "🔥🔥🔥" },
    { id: 44, user: "alex", text: "🔥🔥🔥" },
    { id: 54, user: "alex", text: "🔥🔥🔥" },
  ]);

  const [newComment, setNewComment] = useState("");

  const addComment = () => {
    if (!newComment.trim()) return;

    setComments((prev) => [
      ...prev,
      { id: Date.now(), user: "you", text: newComment },
    ]);

    setNewComment("");
  };

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikes((prev) => prev + 1);
    }
  };

  const handleUnlike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikes((prev) => prev - 1);
    }
  };

  const handleDoubleClick = () => {
    handleLike();

    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 700);
  };

  return (
    <div className="border rounded-lg bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            alt="user"
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold">{post.username}</span>
        </div>
        <MoreHorizontal className="cursor-pointer" />
      </div>

      {/* Image */}
      <div className="relative" onDoubleClick={handleDoubleClick}>
        <img
          src={post.image}
          alt="post"
          className="w-full aspect-square object-cover"
        />

        {/* ❤️ BIG HEART */}
        {showHeart && (
          <Heart
            className="absolute top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2 
        text-transparent fill-red-500 opacity-80 heart-animation"
            size={100}
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between p-3">
        <div className="flex gap-4">
          {/* ❤️ LIKE BUTTON */}
          <Heart
            onClick={isLiked ? handleUnlike : handleLike}
            className={`cursor-pointer transition transform active:scale-125
              ${isLiked ? "text-red-500 fill-red-500" : "hover:text-gray-600"}
            `}
          />

          <Dialog>
            <DialogTrigger asChild>
              <MessageCircle className="cursor-pointer" />
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Comments</DialogTitle>
              </DialogHeader>

              {/* Comments List */}
              <div className="max-h-60 overflow-y-auto space-y-2">
                {comments.map((c) => (
                  <div key={c.id} className="text-sm">
                    <span className="font-semibold mr-2">{c.user}</span>
                    {c.text}
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="flex gap-2 mt-3">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 border rounded px-2 py-1 text-sm"
                />
                <button
                  onClick={addComment}
                  className="text-blue-500 font-semibold"
                >
                  Post
                </button>
              </div>
            </DialogContent>
          </Dialog>
          <Send className="cursor-pointer" />
        </div>

        <Bookmark
          onClick={handleBookmark}
          className={`cursor-pointer transition transform active:scale-125
    ${isBookmarked ? "fill-black text-black" : "hover:text-gray-600"}
  `}
        />
      </div>

      {/* Likes Count */}
      <div className="px-3 text-sm font-semibold">{likes} likes</div>

      {/* Caption */}
      <div className="px-3 pb-3 text-sm">
        <span className="font-semibold mr-2">{post.username}</span>
        {post.caption}
      </div>
    </div>
  );
};

export default Post;
