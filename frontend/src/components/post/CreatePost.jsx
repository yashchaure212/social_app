import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "@/redux/slices/postSlice";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";
import { fetchMe } from "@/redux/slices/authSlice";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CreatePost = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // ✅ Reset when modal closes
  useEffect(() => {
    if (!open) {
      setCaption("");
      setImage(null);
      setPreview("");
    }
  }, [open]);

  // ✅ Clean preview URL (prevent memory leak)
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ basic validation
    if (!file.type.startsWith("image/")) {
      return toast.error("Only image files allowed");
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image must be less than 5MB");
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image || loading) return;

    try {
      const formData = new FormData();

      formData.append("caption", caption);
      formData.append("image", image);

      const res = await dispatch(addPost(formData));

      if (addPost.fulfilled.match(res)) {
        await dispatch(fetchMe());

        toast.success("Post shared successfully 🚀");

        setOpen(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden rounded-3xl border-0 p-0 shadow-2xl sm:max-w-lg">
        {/* Header */}
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-center text-xl font-semibold">Create New Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 p-6">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <img src={user?.profilePicture || "https://ui-avatars.com/api/?name=User"} alt="" className="h-10 w-10 rounded-full object-cover" />

            <span className="font-semibold">{user?.username}</span>
          </div>

          {/* Upload Area */}
          <label className="block cursor-pointer">
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />

            {!preview ? (
              <div className="text-muted-foreground hover:bg-accent/30 flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed transition">
                <ImagePlus className="mb-3 h-10 w-10" />

                <p className="font-medium">Click to upload image</p>

                <p className="text-sm">PNG / JPG / WEBP</p>
              </div>
            ) : (
              <div className="relative">
                <img src={preview} alt="preview" className="h-72 w-full rounded-2xl border object-cover" />

                <label className="absolute top-3 right-3 cursor-pointer rounded-full bg-black/70 px-3 py-2 text-xs text-white">
                  Change Photo
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
              </div>
            )}
          </label>

          {/* Caption */}
          <div>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write a caption..." maxLength={2200} rows={4} className="bg-background w-full resize-none rounded-xl border p-3 outline-none" />

            <div className="text-muted-foreground mt-1 text-right text-xs">{caption.length}/2200</div>
          </div>

          {/* Submit */}
          <Button onClick={handleSubmit} disabled={loading || !image} className="h-11 w-full rounded-xl text-sm font-medium">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Posting...
              </div>
            ) : (
              "Share Post"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
