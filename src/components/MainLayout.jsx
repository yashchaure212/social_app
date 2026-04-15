import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

const MainLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-62.5 border-r h-screen sticky top-0">
        <LeftSidebar />
      </div>

      {/* Center Feed (SCROLL ONLY THIS) */}
      <div className="flex-1 overflow-y-auto flex justify-center no-scrollbar">
        <div className="w-117.5 py-5">
          <Outlet />
        </div>
      </div>

      {/* Right Sidebar (FIXED LIKE INSTAGRAM) */}
      <div className="w-[320px] hidden lg:block sticky top-0 h-screen p-5">
        <RightSidebar />
      </div>
    </div>
  );
};

export default MainLayout;
