import { logout } from "@/redux/slices/authSlice";
import { Home, Search, PlusSquare, LogOut, Compass, MessageCircle, Bell } from "lucide-react";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import CreatePost from "../post/CreatePost";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [openCreate, setOpenCreate] = useState(false);

  const { loading, user: currentUser } = useSelector((state) => state.auth);

  const { notifications } = useSelector((state) => state.notification);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const menuItems = [
    {
      name: "Home",
      icon: Home,
      path: "/",
    },
    {
      name: "Search",
      icon: Search,
      path: "/search",
    },
    {
      name: "Explore",
      icon: Compass,
      path: "/explore",
    },
    {
      name: "Messages",
      icon: MessageCircle,
      path: "/messages",
    },
    {
      name: "Create",
      icon: PlusSquare,
    },
    {
      name: "Notifications",
      icon: Bell,
      path: "/notifications",
    },
  ];

  const isActivePath = (path) => {
    if (!path) return false;

    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const handleNavigate = (item) => {
    if (loading) return;

    if (item.name === "Create") {
      setOpenCreate(true);
      return;
    }

    navigate(item.path);
  };

  const handleLogout = async () => {
    const res = await dispatch(logout());

    if (logout.fulfilled.match(res)) {
      toast.success(res.payload?.message || "Logged out successfully");

      navigate("/login");
    } else {
      toast.error(res.payload?.message || "Logout failed");
    }
  };

  return (
    <>
      <aside className="border-border bg-background sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r px-4 py-6">
        {/* Logo */}
        <div onClick={() => navigate("/")} className="flex cursor-pointer items-center gap-3 px-2 select-none">
          <div className="bg-primary/10 border-primary/20 flex h-12 w-12 items-center justify-center rounded-2xl border">
            <div className="from-primary shadow-primary/30 h-6 w-6 rounded-full bg-gradient-to-br to-violet-400 shadow-lg" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">VYRA</h1>

            <p className="text-muted-foreground text-xs">Connect & Share</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active = isActivePath(item.path);

            return (
              <button key={item.name} onClick={() => handleNavigate(item)} disabled={loading} className={`group relative flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-all duration-200 ${active ? `bg-primary/10 text-primary border-primary/20 border` : `text-muted-foreground hover:bg-accent hover:text-foreground`} `}>
                {active && <div className="bg-primary absolute top-2 bottom-2 left-0 w-1 rounded-r-full" />}

                <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${active ? "stroke-[2.5]" : ""} `} />

                <span className="text-sm font-medium">{item.name}</span>

                {item.name === "Notifications" && unreadCount > 0 && <div className="bg-primary text-primary-foreground ml-auto flex h-[22px] min-w-[22px] items-center justify-center rounded-full text-xs font-semibold">{unreadCount}</div>}
              </button>
            );
          })}

          {/* Profile */}
          <button onClick={() => navigate("/profile")} className={`relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all ${location.pathname.includes("/profile") ? `bg-primary/10 text-primary border-primary/20 border` : `text-muted-foreground hover:bg-accent hover:text-foreground`} `}>
            <img src={currentUser?.profilePicture || "https://ui-avatars.com/api/?name=User"} alt="profile" className="h-8 w-8 rounded-full border object-cover" />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{currentUser?.username}</p>

              <p className="text-muted-foreground text-xs">View Profile</p>
            </div>
          </button>
        </nav>

        <div className="mt-auto">
          <button onClick={handleLogout} disabled={loading} className="text-muted-foreground hover:bg-accent hover:text-foreground flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-all">
            <LogOut className="h-5 w-5" />

            <span className="text-sm font-medium">{loading ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </aside>

      <CreatePost open={openCreate} setOpen={setOpenCreate} />
    </>
  );
};

export default Sidebar;
