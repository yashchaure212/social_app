import React, { useEffect } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import FollowButton from "./FollowButton";
import { fetchUserProfile } from "@/redux/slices/userSlices";

const FollowingList = ({ open, setOpen, following, profileId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.user);

  const { id } = useParams();
  console.log("Following data:", following);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[80vh] overflow-y-auto rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Following</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {following?.length > 0 ? (
            following.map((followedUser) => (
              <div key={followedUser._id} className="flex items-center justify-between">
                {/* User Info */}
                <div
                  onClick={() => {
                    setOpen(false);
                    navigate(`/profile/${followedUser._id}`);
                  }}
                  className="flex flex-1 cursor-pointer items-center gap-3"
                >
                  <img src={followedUser.profilePicture || "/default-avatar.png"} alt={followedUser.username} className="h-11 w-11 rounded-full object-cover" />

                  <div>
                    <p className="text-sm font-semibold">{followedUser.username}</p>

                    {followedUser.bio && <p className="text-muted-foreground max-w-[180px] truncate text-xs">{followedUser.bio}</p>}
                  </div>
                </div>

                {/* Follow Button */}
                {currentUser?._id !== followedUser._id && <FollowButton userProfileId={followedUser._id} onSuccess={() => dispatch(fetchUserProfile(profileId))} />}
              </div>
            ))
          ) : (
            <div className="text-muted-foreground py-10 text-center">Not following anyone yet</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowingList;
