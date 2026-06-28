import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPost } from "@/redux/slices/postSlice";

import PostCard from "../post/PostCard";
import PostSkeleton from "../common/PostSkeleton";

const Home = () => {
  const dispatch = useDispatch();

  const { posts, loading } = useSelector((state) => state.post);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllPost());
  }, [dispatch]);

  if (loading) {
    return <PostSkeleton />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      {/* Welcome Card */}
      <div className="border-border bg-card mb-8 rounded-3xl border p-6">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back 👋</h1>

        <p className="text-muted-foreground mt-2">{user?.username ? `See what your friends are sharing today, ${user.username}.` : "See what your friends are sharing today."}</p>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {posts?.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <div className="border-border bg-card rounded-3xl border py-20 text-center">
            <h2 className="text-xl font-semibold">No Posts Yet</h2>

            <p className="text-muted-foreground mt-2">Follow people or create your first post.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
