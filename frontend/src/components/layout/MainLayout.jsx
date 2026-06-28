import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket } from "@/socket/socket";
import { toast } from "sonner";
import { addNotification } from "@/redux/slices/notificationSlice";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

const MainLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const location = useLocation();
  const isMessagesPage = location.pathname.startsWith("/messages");

  useEffect(() => {
    if (!user?._id) return;
    const socket = connectSocket(user._id);

    socket.on("newNotification", (notification) => {
      dispatch(addNotification(notification));

      if (notification.type === "message") {
        toast.info(`💬 ${notification.sender.username} sent you a message`);
      }

      if (notification.type === "like") {
        toast.info(`❤️ ${notification.sender.username} liked your post`);
      }

      if (notification.type === "follow") {
        toast.info(`👤 ${notification.sender.username} started following you`);
      }
    });

    return () => {
      socket.off("newNotification");
    };
  }, [user]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <div className="h-full w-64 border-r">
        <LeftSidebar />
      </div>

      {/* Center Content */}
      <div className="flex-1 overflow-hidden">
        {isMessagesPage ? (
          <Outlet />
        ) : (
          <div className="flex h-full justify-center overflow-y-auto">
            <div className="w-[600px] py-5">
              <Outlet />
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      {!isMessagesPage && (
        <div className="hidden h-full w-80 border-l lg:block">
          <RightSidebar />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
