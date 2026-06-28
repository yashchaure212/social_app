import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "@/redux/slices/conversationSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";

const ConversationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");

  const { conversations } = useSelector((state) => state.conversation);

  const { onlineUsers } = useSelector((state) => state.onlineUsers);

  const activeUserId = location.pathname.split("/messages/")[1];

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const filteredConversations = conversations.filter((conversation) => conversation.user.username.toLowerCase().includes(search.toLowerCase()));

  const formatTime = (date) => {
    if (!date) return "";

    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (diff < 60) return "now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;

    return `${Math.floor(diff / 604800)}w`;
  };

  return (
    <div className="border-border bg-card flex h-full w-[360px] flex-col border-r">
      {/* Header */}
      <div className="border-border border-b p-5">
        <h2 className="text-foreground text-2xl font-bold">Messages</h2>

        <p className="text-muted-foreground mt-1 text-sm">{conversations.length} conversations</p>

        {/* Search */}
        <div className="bg-muted/50 border-border mt-4 flex items-center gap-3 rounded-2xl border px-4 py-3">
          <Search className="text-muted-foreground h-4 w-4" />

          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations..." className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none" />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredConversations.length === 0 ? (
          <div className="text-muted-foreground flex h-full items-center justify-center text-sm">No conversations found</div>
        ) : (
          filteredConversations.map((conversation) => {
            const isOnline = onlineUsers.includes(conversation.user._id);
            console.log(conversation);

            const isActive = activeUserId === conversation.user._id;

            return (
              <button key={conversation._id} onClick={() => navigate(`/messages/${conversation.user._id}`)} className={`mb-2 flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all duration-200 ${isActive ? `bg-primary/15 border-primary/20 shadow-primary/10 border shadow-lg` : `hover:bg-accent`} `}>
                {/* Avatar */}
                <div className="relative">
                  <img src={conversation.user.profilePicture || "https://ui-avatars.com/api/?name=User"} alt="" className="h-14 w-14 rounded-full border object-cover" />

                  {isOnline && <span className="border-card absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 bg-green-500 shadow shadow-green-500/50" />}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-foreground truncate text-sm font-semibold">{conversation.user.username}</h3>

                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-muted-foreground flex-1 truncate text-sm">
                      {conversation.lastMessage || "Start chatting"} • {formatTime(conversation.updatedAt)}
                    </p>

                    {conversation.unreadCount > 0 && <span className="bg-primary text-primary-foreground ml-2 flex h-[20px] min-w-[20px] items-center justify-center rounded-full text-[10px] font-semibold">{conversation.unreadCount}</span>}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
