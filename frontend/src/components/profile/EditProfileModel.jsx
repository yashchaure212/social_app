import React, { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { useDispatch, useSelector } from "react-redux";

import { EditMyProfile } from "@/redux/slices/authSlice";

import { Camera, Loader2, User, Heart, ImageIcon } from "lucide-react";

import { toast } from "sonner";

const EditProfileModel = ({ open, setOpen, profileData }) => {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  const [editForm, setEditForm] = useState({
    bio: "",
    profilePicture: null,
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (profileData) {
      setEditForm({
        bio: profileData.bio || "",
        profilePicture: null,
      });

      setPreview(profileData.profilePicture || "");
    }
  }, [open, profileData]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // validate image
    if (!file.type.startsWith("image/")) {
      return toast.error("Only image files allowed");
    }

    // validate size
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image must be less than 5MB");
    }

    setEditForm({
      ...editForm,
      profilePicture: file,
    });

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("bio", editForm.bio);

      if (editForm.profilePicture) {
        formData.append("profilePicture", editForm.profilePicture);
      }

      const res = await dispatch(EditMyProfile(formData));

      if (EditMyProfile.fulfilled.match(res)) {
        toast.success("Profile updated successfully");

        setEditForm({
          bio: "",
          profilePicture: null,
        });

        setPreview("");

        setOpen(false);
      } else {
        toast.error(res.payload?.message || "Failed to update profile");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-border bg-card/95 max-h-[90vh] overflow-y-auto rounded-3xl border p-0 shadow-2xl shadow-black/40 backdrop-blur-xl sm:max-w-xl">
        {/* TOP BANNER */}
        <div className="from-primary/30 via-primary/10 to-background relative h-36 bg-gradient-to-r">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="relative px-6 pb-6">
          {/* PROFILE IMAGE */}
          <div className="-mt-16 flex justify-center">
            <div className="group relative">
              <img src={preview || "/default-avatar.png"} alt="profile" className="border-background h-32 w-32 rounded-full border-4 object-cover shadow-2xl" />
              <div className="mt-3 text-center">
                <p className="text-lg font-semibold">@{profileData?.username}</p>
              </div>

              <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100">
                <Camera className="h-6 w-6 text-white" />

                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* HEADER */}
          <div className="mt-5 text-center">
            <DialogTitle className="text-foreground text-2xl font-semibold tracking-tight">Edit Profile</DialogTitle>

            <p className="text-muted-foreground mt-1 text-sm">Update your profile details</p>
          </div>

          {/* STATS */}
          <div className="mt-7 grid grid-cols-3 gap-3">
            {/* Posts */}
            <div className="border-border bg-muted/30 rounded-2xl border p-4 text-center backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <ImageIcon className="text-primary h-5 w-5" />
              </div>

              <p className="text-foreground text-lg font-bold">{profileData?.posts?.length || 0}</p>

              <p className="text-muted-foreground text-xs">Posts</p>
            </div>

            {/* Followers */}
            <div className="border-border bg-muted/30 rounded-2xl border p-4 text-center backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <Heart className="text-primary h-5 w-5" />
              </div>

              <p className="text-foreground text-lg font-bold">{profileData?.followers?.length || 0}</p>

              <p className="text-muted-foreground text-xs">Followers</p>
            </div>

            {/* Following */}
            <div className="border-border bg-muted/30 rounded-2xl border p-4 text-center backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <User className="text-primary h-5 w-5" />
              </div>

              <p className="text-foreground text-lg font-bold">{profileData?.following?.length || 0}</p>

              <p className="text-muted-foreground text-xs">Following</p>
            </div>
          </div>

          {/* USERNAME */}
          <div className="mt-6">
            <label className="text-foreground text-sm font-medium">Username</label>

            <div className="border-border bg-muted/30 text-muted-foreground mt-2 flex h-12 items-center rounded-2xl border px-4">@{profileData?.username}</div>
          </div>

          {/* BIO */}
          <div className="mt-5">
            <label className="text-foreground text-sm font-medium">Bio</label>

            <textarea name="bio" value={editForm.bio} onChange={handleChange} rows={5} maxLength={250} placeholder="Write something about yourself..." className="border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:ring-primary/40 mt-2 w-full resize-none rounded-2xl border p-4 focus:ring-2 focus:outline-none" />

            <div className="text-muted-foreground mt-2 flex justify-between text-xs">
              <p>Tell people about yourself</p>

              <p>{editForm.bio.length}/250</p>
            </div>
          </div>

          {/* ACCOUNT PREVIEW */}
          <div className="border-border bg-muted/20 mt-6 rounded-2xl border p-5">
            <h3 className="text-foreground mb-4 text-sm font-semibold">Account Overview</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Comments</span>

                <span className="text-foreground font-medium">{profileData?.posts?.reduce((acc, post) => acc + (post.comments?.length || 0), 0)}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Likes</span>

                <span className="text-foreground font-medium">{profileData?.posts?.reduce((acc, post) => acc + (post.likes?.length || 0), 0)}</span>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-8 flex gap-3">
            {/* Cancel */}
            <button onClick={() => setOpen(false)} className="bg-primary text-primary-foreground h-12 flex-1 rounded-2xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]">
              Cancel
            </button>

            {/* Save */}
            <button onClick={handleUpdate} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 flex h-12 flex-1 items-center justify-center rounded-2xl font-medium shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModel;
