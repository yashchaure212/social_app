import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart, MessageCircle, Send, Bookmark, Smile, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import { addComment, getComments } from "@/redux/slices/commentSlice";
import { toggleLikePost } from "@/redux/slices/postSlice";
import { useNavigate } from "react-router-dom";

const CommentsModal = ({ open, setOpen, post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openOptions, setOpenOptions] = useState(false);

  const { comments, loading } = useSelector((state) => state.comment);
  const currentUser = useSelector((state) => state.auth.user);

  const [text, setText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [hasCommented, setHasCommented] = useState(false);

  const inputRef = useRef(null);
  const commentsEndRef = useRef(null);

  const handleProfileClick = () => {
    setOpen(false); // close modal first

    setTimeout(() => {
      navigate(`/profile/${post.author._id}`);
    }, 100);
  };

  // fetch comments
  useEffect(() => {
    if (open && post?._id) {
      dispatch(getComments(post._id));

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open, post, dispatch]);

  // auto scroll only after adding comment
  useEffect(() => {
    if (hasCommented) {
      commentsEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });

      setHasCommented(false);
    }
  }, [comments, hasCommented]);

  // like check
  const liked = post?.likes?.some((id) => id.toString() === currentUser?._id?.toString());

  // instagram style date
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = {
      y: 31536000,
      mo: 2592000,
      w: 604800,
      d: 86400,
      h: 3600,
      m: 60,
    };

    for (const key in intervals) {
      const value = Math.floor(seconds / intervals[key]);

      if (value >= 1) {
        return `${value}${key}`;
      }
    }

    return "now";
  };

  const createdDate = formatTimeAgo(post?.createdAt);

  // add comment
  const handleComment = async () => {
    if (!text.trim() || commentLoading) return;

    try {
      setCommentLoading(true);

      const commentText = text;

      setText("");

      await dispatch(
        addComment({
          postId: post._id,
          text: commentText,
        }),
      );

      setHasCommented(true);

      dispatch(getComments(post._id));
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false} className="flex h-[88vh] max-h-[88vh] w-[1100px] flex-col overflow-hidden p-0">
        <div className="grid h-full lg:grid-cols-[500px_1fr]">
          {/* LEFT IMAGE */}
          <div className="hidden h-full overflow-hidden bg-black lg:block">
            <img src={post?.image} alt="post" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-card flex h-full min-h-0 min-w-0 flex-col">
            {/* HEADER */}
            <div className="border-border/60 flex h-20 items-center justify-between border-b px-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <img onClick={handleProfileClick} src={post?.author?.profilePicture || "https://ui-avatars.com/api/?name=User"} alt="profile" className="border-primary/20 h-11 w-11 rounded-full border-2 object-cover" />

                <div>
                  <p className="text-sm font-semibold">{post?.author?.username}</p>

                  <p className="text-muted-foreground text-xs">{createdDate}</p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:bg-accent flex h-10 w-10 items-center justify-center rounded-xl">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleProfileClick();
                    }}
                  >
                    View Profile
                  </DropdownMenuItem>
                  {currentUser?._id === post.author?._id && (
                    <>
                      <DropdownMenuItem>Edit Post</DropdownMenuItem>

                      <DropdownMenuItem className="text-red-500">Delete Post</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* COMMENTS */}
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto scroll-smooth px-6 py-5">
              {/* CAPTION */}
              <div className="flex gap-3">
                <img src={post?.author?.profilePicture || "https://ui-avatars.com/api/?name=User"} alt="" className="h-10 w-10 rounded-full border object-cover" />

                <div className="bg-muted/40 border-border/50 flex-1 rounded-3xl border px-4 py-3 backdrop-blur-md">
                  <span className="mr-2 font-semibold">{post?.author?.username}</span>

                  {post?.caption}

                  <p className="text-muted-foreground mt-2 text-xs">{createdDate}</p>
                </div>
              </div>

              {/* COMMENTS LIST */}
              {comments?.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    <img src={comment.author?.profilePicture || "https://ui-avatars.com/api/?name=User"} alt="" className="h-10 w-10 rounded-full border object-cover" />

                    <div className="bg-muted/30 border-border/50 flex-1 rounded-3xl border px-4 py-3 backdrop-blur-md">
                      <span className="mr-2 font-semibold">{comment.author?.username}</span>

                      {comment.text}

                      <p className="text-muted-foreground mt-2 text-xs">now</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground text-sm">No comments yet</p>
                </div>
              )}

              <div ref={commentsEndRef}></div>
            </div>

            {/* FOOTER */}
            <div className="bg-card/95 border-border/60 sticky bottom-0 border-t backdrop-blur-xl">
              {/* ACTIONS */}
              <div className="flex items-center justify-between px-6 pt-4">
                <div className="flex gap-5">
                  <Heart onClick={() => dispatch(toggleLikePost(post._id))} className={`h-6 w-6 cursor-pointer transition-all hover:scale-110 ${liked ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-foreground"} `} />

                  <MessageCircle className="h-6 w-6 cursor-pointer transition-all hover:scale-110" />

                  <Send className="h-6 w-6 cursor-pointer transition-all hover:scale-110" />
                </div>

                <Bookmark className="h-6 w-6 cursor-pointer transition-all hover:scale-110" />
              </div>

              {/* LIKES */}
              <div className="px-5">
                <p className="text-foreground text-sm font-semibold">{post?.likes?.length || 0} likes</p>
              </div>

              {/* DATE */}
              <div className="px-5 pt-1 pb-4">
                <p className="text-muted-foreground text-[11px] tracking-wide uppercase">{createdDate}</p>
              </div>

              {/* INPUT */}
              <div className="bg-muted/40 border-border/60 flex items-center gap-3 rounded-2xl border px-4 py-3">
                <Smile className="text-muted-foreground h-5 w-5" />

                <input
                  ref={inputRef}
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleComment();
                    }
                  }}
                  placeholder="Write a comment..."
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <button onClick={handleComment} disabled={!text.trim()} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsModal;
