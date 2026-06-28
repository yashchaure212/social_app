import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { followUserThunk, unfollowUserThunk } from "@/redux/slices/userSlices";
import { Loader2 } from "lucide-react";

const FollowButton = ({ userProfileId, onSuccess }) => {
  if (!userProfileId) return null;

  const dispatch = useDispatch();

  const { user: currentUser } = useSelector((state) => state.auth);
  const { loadingFollow, loadingUnfollow } = useSelector((state) => state.user);

  if (currentUser?._id === userProfileId) return null;

  const isFollowing = currentUser?.following?.some((item) => {
    const id = typeof item === "string" ? item : item?._id;
    return id === userProfileId;
  });

  const loading = loadingFollow || loadingUnfollow;

  const handleClick = async (e) => {
    e.stopPropagation();

    if (loading || !userProfileId) return;

    if (isFollowing) {
      await dispatch(unfollowUserThunk(userProfileId));
    } else {
      await dispatch(followUserThunk(userProfileId));
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <button onClick={handleClick} disabled={loading} className={`flex h-10 min-w-[120px] items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all duration-200 ${isFollowing ? "bg-accent text-foreground border-border border" : "bg-primary text-primary-foreground shadow-primary/20 shadow-lg"} ${loading ? "cursor-not-allowed opacity-70" : "hover:scale-[1.02]"} `}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : isFollowing ? (
        "Following"
      ) : (
        "Follow"
      )}
    </button>
  );
};

export default FollowButton;
