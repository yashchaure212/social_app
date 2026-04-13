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
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";

const leftSidebarItems = [
  {
    icon: <Home />,
    text: "Home",
  },
  {
    icon: <MessageCircle />,
    text: "Messages",
  },
  {
    icon: <Search />,
    text: "Search",
  },
  {
    icon: <Film />,
    text: "Explore",
  },
  {
    icon: <Heart />,
    text: "Notification",
  },
  {
    icon: <Plus />,
    text: "Create",
  },
  {
    icon: <Ellipsis />,
    text: "More",
  },
  {
    icon: (
      <Avatar>
        <AvatarImage src="https://github.com/evilrabbit.png" alt="user" />
        <AvatarFallback>ER</AvatarFallback>
        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
      </Avatar>
    ),
    text: "Profile",
  },
  {
    icon: <LogOut />,
    text: "Logout",
  },
];

const LeftSidebar = () => {
  return (
    <div className="h-screen w-[250px] border-r p-5">
      <h1 className="text-xl font-bold mb-8">LOGO</h1>
      <div className="flex flex-col gap-4">
        {leftSidebarItems.map((item, index) => {
          return (
            <div
              key={index}
              className="flex items-center gap-4 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            >
              <div className="text-xl">{item.icon}</div>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeftSidebar;
