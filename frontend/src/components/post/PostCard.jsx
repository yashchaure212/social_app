import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLikePost } from "@/redux/slices/postSlice";
import { useState } from "react";
import { addComment } from "@/redux/slices/commentSlice";
import CommentsModal from "./CommentsModal";
import { useNavigate } from "react-router-dom";
import { formatPostDate } from "@/utils/formatDate";
import PostOptions from "../post/PostOptions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [openComments, setOpenComments] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  const liked = post.likes?.some((id) => id.toString() === currentUser?._id?.toString());

  const createdDate = formatPostDate(post.createdAt);

  const handleComment = () => {
    if (!text.trim()) return;

    dispatch(
      addComment({
        postId: post._id,
        text,
      }),
    );

    setText("");
  };

  return (
    <div className="bg-card border-border overflow-hidden rounded-[32px] border shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-all duration-300 hover:shadow-[0_10px_40px_rgba(99,102,241,0.12)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <img onClick={() => navigate(`/profile/${post.author._id}`)} src={post.author?.profilePicture} alt="profile" className="border-primary/20 h-12 w-12 cursor-pointer rounded-full border-2 object-cover" />

          <div>
            <p onClick={() => navigate(`/profile/${post.author._id}`)} className="hover:text-primary cursor-pointer text-sm font-semibold transition-colors">
              {post.author?.username}
            </p>

            <p className="text-muted-foreground text-xs">{createdDate}</p>
          </div>
        </div>

        <PostOptions open={openOptions} setOpen={setOpenOptions} isMyPost={currentUser?._id === post?.author?._id} onProfile={() => navigate(`/profile/${post.author._id}`)} onDelete={() => handleDelete(post._id)} onEdit={() => handleEdit(post)} />
      </div>

      {/* Image */}
      <div className="border-border aspect-square overflow-hidden border-y">
        <img src={post.image} alt="post" className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
      </div>

      {/* Actions */}
      <div className="space-y-3 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button onClick={() => dispatch(toggleLikePost(post._id))} className="hover:bg-accent rounded-xl p-2 transition">
              <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
            </button>

            <button onClick={() => setOpenComments(true)} className="hover:bg-accent rounded-xl p-2 transition">
              <MessageCircle className="h-5 w-5" />
            </button>

            <button className="hover:bg-accent rounded-xl p-2 transition">
              <Send className="h-5 w-5" />
            </button>
          </div>

          <button className="hover:bg-accent rounded-xl p-2 transition">
            <Bookmark className="h-5 w-5" />
          </button>
        </div>

        {/* Likes */}
        <div className="flex items-center gap-2">
          <div className="bg-primary h-2 w-2 rounded-full" />

          <p className="text-sm font-semibold">{post.likes?.length || 0} likes</p>
        </div>

        {/* Caption */}
        <div className="bg-muted/40 rounded-2xl p-4">
          <p className="text-sm leading-relaxed">
            <span className="mr-2 font-semibold">{post.author?.username}</span>

            {post.caption}
          </p>
        </div>
        <div className="bg-muted/30 flex gap-2 rounded-2xl p-2">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-transparent px-3 py-2 text-sm outline-none" />

          <button onClick={handleComment} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-medium transition hover:opacity-90">
            Post
          </button>
        </div>

        {/* Comments */}
        <p onClick={() => setOpenComments(true)} className="text-muted-foreground hover:text-primary cursor-pointer text-sm transition-colors">
          View all {post.comments?.length || 0} comments
        </p>

        <CommentsModal open={openComments} setOpen={setOpenComments} post={post} />
      </div>
    </div>
  );
};

export default PostCard;
