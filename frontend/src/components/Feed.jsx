import React from "react";
import Post from "./Post";
import Stories from "./Stories";

const posts = [
  {
    id: 1,
    username: "john_doe",
    image: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
    caption: "Enjoying the view 😍",
  },
  {
    id: 2,
    username: "yash_dev",
    image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    caption: "Coding + Coffee ☕💻",
  },
];

const Feed = () => {
  return (
    <div className="flex flex-col gap-6 max-w-full">
      {/* 🔴 Stories at top */}
      <Stories />

      {/* Posts */}
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
