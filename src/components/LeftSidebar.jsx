import {
  Ellipsis,
  Film,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  Plus,
  Search,
} from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "@/services/authServices";
import { toast } from "sonner";

const leftSidebarItems = [
  { icon: <Home />, text: "Home", path: "/home" },
  { icon: <MessageCircle />, text: "Messages", path: "/messages" },
  { icon: <Search />, text: "Search" },
  { icon: <Film />, text: "Explore" },
  { icon: <Heart />, text: "Notification" },
  { icon: <Plus />, text: "Create" },
  { icon: <Ellipsis />, text: "More" },
  {
    icon: (
      <Avatar>
        <AvatarImage src="https://github.com/evilrabbit.png" />
        <AvatarFallback>ER</AvatarFallback>
        <AvatarBadge className="bg-green-600" />
      </Avatar>
    ),
    text: "Profile",
    path: "/profile",
  },
  { icon: <LogOut />, text: "Logout" },
];

const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSidebarItem = async (item) => {
    if (item.text === "Logout") {
      try {
        const response = await logoutUser();
        toast.success(response.data.message);
        navigate("/login");
      } catch (error) {
        toast.error(error.response?.data?.message || "Error");
      }
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className="h-screen p-5 overflow-y-auto no-scrollbar">

      <h1 className="text-2xl font-bold mb-8">Instagram</h1>

      <div className="flex flex-col gap-4">
        {leftSidebarItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleSidebarItem(item)}
            className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer transition
              ${
                location.pathname === item.path
                  ? "bg-gray-200 font-semibold"
                  : "hover:bg-gray-100"
              }
            `}
          >
            <div className="text-xl">{item.icon}</div>
            <span className="text-sm">{item.text}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default LeftSidebar;