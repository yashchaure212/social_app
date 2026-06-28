import { Button } from "@/components/ui/button";
import { Grid3X3, Bookmark, UserRound, Heart, MessageCircle, Pen } from "lucide-react";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { fetchUserProfile } from "@/redux/slices/userSlices";
import FollowButton from "../user/FollowButton";
import FollowersList from "../user/FollowersList";
import FollowingList from "../user/FollowingList";
import EditProfileModel from "./EditProfileModel";

// imports
import PostDetails from "../pages/PostDetails";

const Profile = () => {
  const navigate = useNavigate();
  const [openPost, setOpenPost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleOpenPost = (postId) => {
    setSelectedPostId(postId);
    setOpenPost(true);
  };

  const { id } = useParams();
  const dispatch = useDispatch();
  const [openProfileEdit, setOpenProfileEdit] = useState(false);

  // Logged-in user
  const { user, loading } = useSelector((state) => state.auth);
  // Other user
  const { userProfile, loadingUserProfile } = useSelector((state) => state.user);

  // Modal state
  const [openFollowerList, setOpenFollowerList] = useState(false);
  const [openFollowingList, setOpenFollowingList] = useState(false);

  // Check profile type
  const isMyProfile = !id || user?._id === id;

  // Fetch other profile if needed
  useEffect(() => {
    if (!id) return;

    if (user?._id === id) return;

    dispatch(fetchUserProfile(id));
  }, [id, user, dispatch]);

  // Final data
  const profileData = isMyProfile ? user : userProfile || user;

  console.log("AUTH USER", user);
  console.log("AUTH USER POSTS", user?.posts);
  console.log("PROFILE DATA", profileData);
  console.log("PROFILE POSTS", profileData?.posts);

  // Loading state
  if (loading || (!isMyProfile && loadingUserProfile)) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse px-6 py-10">
        <div className="flex items-center gap-10">
          <div className="h-32 w-32 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-4">
            <div className="h-6 w-40 rounded bg-gray-200" />
            <div className="h-4 w-72 rounded bg-gray-200" />
            <div className="h-4 w-56 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${profileData._id}`;

    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const followersCount = Array.isArray(profileData?.followers) ? profileData.followers.length : 0;

  const followingCount = Array.isArray(profileData?.following) ? profileData.following.length : 0;

  if (!profileData || !profileData._id) return null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <EditProfileModel open={openProfileEdit} setOpen={setOpenProfileEdit} profileData={profileData} />

      {/* Profile Header Card */}
      <div className="bg-card border-border rounded-3xl border p-8 shadow-sm">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          {/* Avatar */}
          <div className="group relative">
            <img src={profileData.profilePicture || "/default-avatar.png"} alt="profile" className="ring-primary/20 border-border h-32 w-32 rounded-full border object-cover ring-4 md:h-40 md:w-40" />

            {isMyProfile && (
              <button onClick={() => setOpenProfileEdit(true)} className="bg-primary absolute right-2 bottom-2 rounded-full p-2 text-white opacity-0 transition group-hover:opacity-100">
                <Pen className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Right Side */}
          <div className="flex-1 space-y-6">
            {/* Username */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <h1 className="text-3xl font-bold">{profileData.username}</h1>

              <div className="flex gap-2">
                {isMyProfile ? (
                  <>
                    <Button variant="outline" onClick={() => setOpenProfileEdit(true)}>
                      Edit Profile
                    </Button>

                    <Button variant="secondary" onClick={handleShareProfile}>
                      Share Profile
                    </Button>
                  </>
                ) : (
                  <>
                    <FollowButton userProfileId={profileData._id} />

                    <Button variant="outline" onClick={() => navigate(`/messages/${profileData._id}`)}>
                      Message
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/40 rounded-2xl p-4 text-center">
                <p className="text-xl font-bold">{profileData.posts?.length || 0}</p>

                <p className="text-muted-foreground text-sm">Posts</p>
              </div>

              <div onClick={() => setOpenFollowerList(true)} className="bg-muted/40 cursor-pointer rounded-2xl p-4 text-center">
                <p className="text-xl font-bold">{followersCount}</p>

                <p className="text-muted-foreground text-sm">Followers</p>
              </div>

              <div onClick={() => setOpenFollowingList(true)} className="bg-muted/40 cursor-pointer rounded-2xl p-4 text-center">
                <p className="text-xl font-bold">{followingCount}</p>

                <p className="text-muted-foreground text-sm">Following</p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <p className="font-semibold">{profileData.username}</p>

              <p className="text-muted-foreground mt-1">{profileData.bio || "No bio added yet"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-border mt-8 flex justify-center gap-10 border-b">
        <button className="border-primary text-primary flex items-center gap-2 border-b-2 py-4">
          <Grid3X3 className="h-4 w-4" />
          POSTS
        </button>

        {isMyProfile && (
          <>
            <button className="text-muted-foreground flex items-center gap-2 py-4">
              <Bookmark className="h-4 w-4" />
              SAVED
            </button>
          </>
        )}
      </div>

      {/* Posts Grid */}
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        {profileData.posts?.length > 0 ? (
          profileData.posts.map((post) => (
            <div key={post._id} onClick={() => handleOpenPost(post._id)} className="group border-border relative aspect-square cursor-pointer overflow-hidden rounded-2xl border">
              <img src={post.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />

              <div className="absolute inset-0 flex items-center justify-center gap-6 bg-black/50 text-white opacity-0 transition group-hover:opacity-100">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 fill-white" />
                  {post.likes?.length || 0}
                </div>

                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {post.comments?.length || 0}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 py-20 text-center">
            <p className="text-muted-foreground">No posts yet</p>
          </div>
        )}
      </div>

      <FollowersList open={openFollowerList} setOpen={setOpenFollowerList} followers={profileData.followers} profileId={profileData._id} />

      <FollowingList open={openFollowingList} setOpen={setOpenFollowingList} following={profileData.following} profileId={profileData._id} />
    </div>
  );
};

export default Profile;
