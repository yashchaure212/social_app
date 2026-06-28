import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markReadThunk } from "@/redux/slices/notificationSlice";

import { Bell } from "lucide-react";

const Notifications = () => {
  const dispatch = useDispatch();

  const { notifications } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    notifications.forEach((notification) => {
      if (!notification.read) {
        dispatch(markReadThunk(notification._id));
      }
    });
  }, [notifications, dispatch]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Notifications</h1>

        <p className="text-muted-foreground mt-2">Stay updated with messages, follows and activities.</p>
      </div>

      {/* Empty State */}
      {notifications.length === 0 ? (
        <div className="border-border bg-card rounded-3xl border p-12 text-center">
          <Bell className="text-primary mx-auto mb-4 h-12 w-12" />

          <h2 className="text-xl font-semibold">No Notifications</h2>

          <p className="text-muted-foreground mt-2">You're all caught up.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification._id} className="border-border bg-card hover:bg-accent/50 flex items-center gap-4 rounded-3xl border p-4 transition-all duration-200">
              {/* Avatar */}
              <div className="relative">
                <img src={notification.sender.profilePicture} alt="" className="h-14 w-14 rounded-full border object-cover" />

                {!notification.read && <span className="bg-primary absolute top-0 right-0 h-3 w-3 rounded-full" />}
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold">{notification.sender.username}</span> {notification.text}
                </p>

                <p className="text-muted-foreground mt-1 text-xs">
                  {new Date(notification.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;