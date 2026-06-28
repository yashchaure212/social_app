import { useEffect, useState } from "react";

import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { fetchSinglePost, toggleLikePost } from "@/redux/slices/postSlice";

import { addComment, deleteComment } from "@/redux/slices/commentSlice";

const PostDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { singlePost, singlePostLoading, singlePostError } = useSelector((state) => state.post);

  const [text, setText] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchSinglePost(id));
    }
  }, [dispatch, id]);

  const handleLike = () => {
    dispatch(toggleLikePost(singlePost._id));
  };

  const handleAddComment = async () => {
    if (!text.trim()) return;

    const res = await dispatch(
      addComment({
        postId: singlePost._id,
        text,
      }),
    );

    if (addComment.fulfilled.match(res)) {
      setText("");
    }
  };

  const handleDeleteComment = async (commentId) => {
    dispatch(
      deleteComment({
        commentId,
        postId: singlePost._id,
      }),
    );
  };

  const isLiked = singlePost?.likes?.includes(user?._id);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  if (singlePostLoading) {
    return (
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6">
        <div className="border-border bg-card animate-pulse overflow-hidden rounded-3xl border">
          <div className="grid lg:grid-cols-[minmax(500px,1fr)_420px]">
            <div className="bg-muted h-[88vh]" />
            <div className="bg-card border-border h-[88vh] border-l" />
          </div>
        </div>
      </div>
    );
  }

  if (singlePostError) {
    return (
      <div className="mx-auto w-full max-w-[1400px] px-4 py-10">
        <div className="bg-card border-border rounded-3xl border p-6 text-red-400">Failed to load post</div>
      </div>
    );
  }

  if (!singlePost) return null;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6">
      <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-2xl shadow-black/20">
        <div className="grid lg:grid-cols-[minmax(500px,1fr)_420px]">
          {/* LEFT IMAGE */}
          <div className="flex h-[88vh] items-center justify-center overflow-hidden bg-black">
            <img src={singlePost.image} alt="post" className="h-full w-full object-cover" />
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-card text-card-foreground flex h-[88vh] min-w-[420px] flex-col">
            {/* HEADER */}
            <div className="border-border flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-3">
                <img src={singlePost.author?.profilePicture || "/default-avatar.png"} alt="profile" className="border-border h-10 w-10 rounded-full border object-cover" />

                <div>
                  <p className="text-sm font-semibold">{singlePost.author?.username}</p>

                  <p className="text-muted-foreground text-xs">{formatDate(singlePost.createdAt)}</p>
                </div>
              </div>

              <button className="hover:bg-accent rounded-xl p-2 transition">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* COMMENTS */}
            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
              {/* Caption */}
              <div className="flex gap-3">
                <img src={singlePost.author?.profilePicture || "/default-avatar.png"} alt="profile" className="border-border h-9 w-9 rounded-full border object-cover" />

                <div className="bg-accent/40 border-border max-w-[90%] rounded-2xl border px-4 py-3">
                  <p className="text-sm leading-relaxed">
                    <span className="mr-2 font-semibold">{singlePost.author?.username}</span>

                    {singlePost.caption}
                  </p>

                  <p className="text-muted-foreground mt-2 text-xs">{formatDate(singlePost.createdAt)}</p>
                </div>
              </div>

              {/* Comments */}
              {singlePost.comments?.length > 0 ? (
                singlePost.comments.map((comment) => (
                  <div key={comment._id} className="group flex gap-3">
                    <img src={comment.author?.profilePicture || "/default-avatar.png"} alt="profile" className="border-border h-9 w-9 rounded-full border object-cover" />

                    <div className="bg-accent/30 border-border flex-1 rounded-2xl border px-4 py-3">
                      <p className="text-sm leading-relaxed">
                        <span className="mr-2 font-semibold">{comment.author?.username}</span>

                        {comment.text}
                      </p>

                      <div className="mt-2 flex items-center gap-3">
                        <p className="text-muted-foreground text-xs">{formatDate(comment.createdAt)}</p>

                        {comment.author?._id === user?._id && (
                          <button onClick={() => handleDeleteComment(comment._id)} className="text-xs text-red-400 opacity-0 transition group-hover:opacity-100">
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">No comments yet</div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="border-border border-t">
              {/* Icons */}
              <div className="flex items-center justify-between px-5 pt-4">
                <div className="flex items-center gap-5">
                  <button onClick={handleLike} className="transition hover:scale-110">
                    <Heart className={`h-6 w-6 transition ${isLiked ? "fill-red-500 text-red-500" : "text-foreground"}`} />
                  </button>

                  <button className="transition hover:scale-110">
                    <MessageCircle className="text-foreground h-6 w-6" />
                  </button>

                  <button className="transition hover:scale-110">
                    <Send className="text-foreground h-6 w-6" />
                  </button>
                </div>

                <button className="transition hover:scale-110">
                  <Bookmark className="text-foreground h-6 w-6" />
                </button>
              </div>

              {/* Likes */}
              <div className="px-5 pt-3">
                <p className="text-sm font-semibold">{singlePost.likes?.length || 0} likes</p>

                <p className="text-muted-foreground mt-1 text-xs">View all {singlePost.comments?.length || 0} comments</p>
              </div>

              {/* Add Comment */}
              <div className="px-5 py-4">
                <div className="bg-accent/40 border-border flex items-center gap-3 rounded-2xl border px-4 py-3">
                  <Smile className="text-muted-foreground h-5 w-5" />

                  <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment..." className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none" />

                  <button onClick={handleAddComment} disabled={!text.trim()} className="text-primary text-sm font-semibold disabled:opacity-40">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;