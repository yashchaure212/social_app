import React from "react";
import { Button } from "@/components/ui/button";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { MoreHorizontal } from "lucide-react";

const PostOptions = ({ open, setOpen, isMyPost, onDelete, onEdit, onProfile }) => {
  return (
    <>
      {/* Trigger */}
      <button onClick={() => setOpen(true)} className="hover:bg-muted rounded-full p-2 transition">
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[320px] overflow-hidden rounded-2xl p-0">
          <div className="flex flex-col text-sm">
            {/* Share */}
            <button className="hover:bg-muted py-4 font-medium transition">Share</button>

            <div className="border-t" />

            {/* Copy Link */}
            <button className="hover:bg-muted py-4 transition">Copy Link</button>

            <div className="border-t" />

            {/* Profile */}
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                onProfile?.();
                setOpen(false);
              }}
            >
              View Profile
            </Button>

            {isMyPost && (
              <>
                <div className="border-t" />

                <button onClick={onEdit} className="hover:bg-muted py-4 transition">
                  Edit
                </button>

                <div className="border-t" />

                <button onClick={onDelete} className="hover:bg-muted py-4 font-semibold text-red-500 transition">
                  Delete
                </button>
              </>
            )}

            <div className="border-t" />

            {/* Cancel */}
            <button onClick={() => setOpen(false)} className="hover:bg-muted py-4 font-medium transition">
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostOptions;
