import { fetchSuggestedUsers, followUserThunk } from "@/redux/slices/userSlices";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const RightSidebar = () => {
  const dispatch = useDispatch();

  const { suggestedUsers, loadingSuggested } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchSuggestedUsers());
  }, [dispatch]);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-400">Suggested Users</h2>

        <span className="text-xs text-zinc-500">{suggestedUsers.length} users</span>
      </div>

      {loadingSuggested && <p className="text-sm text-zinc-500">Loading suggestions...</p>}

      {suggestedUsers.map((user) => (
        <div key={user._id} className="mb-3 flex items-center justify-between gap-2 p-2">
          <div className="flex min-w-0 items-center gap-2">
            <img src={user.profilePicture} alt={user.username} className="h-8 w-8 flex-shrink-0 rounded-full object-cover" />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.username}</p>

              <p className="truncate text-xs text-zinc-500">{user.bio || "No bio yet"}</p>
            </div>
          </div>

          <button
            onClick={async () => {
              await dispatch(followUserThunk(user._id));
              dispatch(fetchSuggestedUsers());
            }}
            className="flex-shrink-0 text-xs font-semibold text-blue-500"
          >
            Follow
          </button>
        </div>
      ))}
    </div>
  );
};

export default RightSidebar;
