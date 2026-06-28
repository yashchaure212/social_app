import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import FollowButton from "./FollowButton";
import { fetchUserProfile } from "@/redux/slices/userSlices";

const FollowersList = ({ open, setOpen, followers, profileId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[80vh] overflow-y-auto rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Followers</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {followers?.length > 0 ? (
            followers.map((follower) => (
              <div key={follower._id} className="flex items-center justify-between">
                {/* User Info */}
                <div
                  onClick={() => {
                    setOpen(false);
                    navigate(`/profile/${follower._id}`);
                  }}
                  className="flex flex-1 cursor-pointer items-center gap-3"
                >
                  <img src={follower.profilePicture || "/default-avatar.png"} alt={follower.username} className="h-11 w-11 rounded-full object-cover" />

                  <div>
                    <p className="text-sm font-semibold">{follower.username}</p>

                    {follower.bio && <p className="text-muted-foreground max-w-[180px] truncate text-xs">{follower.bio}</p>}
                  </div>
                </div>

                {/* Follow Button */}
                {currentUser?._id !== follower._id && <FollowButton userProfileId={follower._id} onSuccess={() => dispatch(fetchUserProfile(profileId))} />}
              </div>
            ))
          ) : (
            <div className="text-muted-foreground py-10 text-center">No followers yet</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersList;