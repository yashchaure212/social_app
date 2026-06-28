import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "@/redux/slices/userSlices";

import { fetchMessages, sendMessageThunk } from "@/redux/slices/chatSlice";
import { fetchConversations } from "@/redux/slices/conversationSlice";
import ConversationList from "../chat/ConversationList";
import { addMessage } from "@/redux/slices/chatSlice";
import { setOnlineUsers } from "@/redux/slices/onlineUserSlice";
import { markSeenThunk } from "@/redux/slices/chatSlice";
import { addNotification } from "@/redux/slices/notificationSlice";
import { toast } from "sonner";
import { getSocket } from "@/socket/socket";

const Messages = () => {
  const socket = getSocket();
  const messagesContainerRef = useRef(null);
  const { userProfile } = useSelector((state) => state.user);

  const socketRef = useRef(null);

  const { id } = useParams();

  const dispatch = useDispatch();
  const bottomRef = useRef(null);

  const { messages, loading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchMessages(id));
      dispatch(fetchUserProfile(id));

      dispatch(markSeenThunk(id));
      dispatch(fetchConversations());
    }
  }, [dispatch, id]);

  useEffect(() => {
    const socket = getSocket();

    if (!socket) return;

    socketRef.current = socket;

    socket.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    socket.on("newMessage", (message) => {
      dispatch(addMessage(message));
      dispatch(fetchConversations());
    });

    socket.on("messagesSeen", () => {
      dispatch(fetchMessages(id));
    });

    socket.on("userTyping", () => {
      setTyping(true);
    });

    socket.on("userStopTyping", () => {
      setTyping(false);
    });

    return () => {
      socket.off("getOnlineUsers");
      socket.off("newMessage");
      socket.off("messagesSeen");
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    if (!id || messages.length === 0) return;

    const hasUnread = messages.some((msg) => String(msg.senderId) === String(id) && !msg.seen);

    if (hasUnread) {
      dispatch(markSeenThunk(id));
    }
  }, [messages, id, dispatch]);

  const { onlineUsers } = useSelector((state) => state.onlineUsers);

  const isOnline = onlineUsers.includes(id);

  const formatMessageTime = (date) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (diff < 60) return "now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;

    return `${Math.floor(diff / 604800)}w`;
  };

  const sendMessage = () => {
    if (!text.trim()) return;

    dispatch(
      sendMessageThunk({
        userId: id,
        message: text,
      }),
    );

    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (!id) {
    return (
      <div className="flex h-screen">
        <ConversationList />

        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-7xl">💬</div>

            <h2 className="text-3xl font-bold">Your Messages</h2>

            <p className="mt-3 text-zinc-400">Send private photos and messages to a friend or group.</p>

            <button className="mt-6 rounded-lg bg-blue-500 px-6 py-3 hover:bg-blue-600">Send Message</button>
          </div>
        </div>
      </div>
    );
  }

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-full">
  //       <div className="text-zinc-400 animate-pulse">Loading messages...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-card text-card-foreground border-border flex h-[calc(100vh-40px)] flex-col overflow-hidden rounded-3xl border">
      {/* Header */}
      <div className="border-border bg-card flex items-center justify-between border-b px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <img src={userProfile?.profilePicture || "https://ui-avatars.com/api/?name=User"} alt={userProfile?.username} className="h-12 w-12 rounded-full object-cover" />

          <div>
            <h2 className="text-lg font-semibold">{userProfile?.username}</h2>
            <p className="text-muted-foreground text-xs">@{userProfile?.username}</p>

            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-green-500" : "bg-zinc-500"}`} />

              <p className="text-muted-foreground text-sm">{typing ? "Typing..." : isOnline ? "Online" : "Offline"}</p>
            </div>
          </div>
        </div>
      </div>

      {messages.length === 0 && (
        <div className="mt-20 flex justify-center">
          <p className="text-zinc-500">Start your conversation 👋</p>
        </div>
      )}

      {/* Messages */}
      <div ref={messagesContainerRef} className="bg-background flex-1 space-y-3 overflow-y-auto p-6">
        {messages?.map((msg) => {
          const isMine = String(msg.senderId) === String(user?._id);

          return (
            <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-3xl px-4 py-3 break-words shadow-sm ${isMine ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"} `}>
                {msg.text}
                <div className="mt-1 flex items-center justify-end gap-1">
                  <p className="text-[10px] opacity-70">{formatMessageTime(msg.createdAt)}</p>

                  {isMine && <span className={`text-[11px] font-semibold ${msg.seen ? "text-sky-300" : "text-zinc-300"}`}>{msg.seen ? "✓✓" : "✓"}</span>}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="border-border bg-card flex items-center gap-3 border-t p-4">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);

            socketRef.current.emit("typing", {
              senderId: user._id,
              receiverId: id,
            });

            clearTimeout(typingTimeoutRef.current);

            typingTimeoutRef.current = setTimeout(() => {
              socketRef.current.emit("stopTyping", {
                receiverId: id,
              });
            }, 1000);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/30 flex-1 rounded-full border px-5 py-3 outline-none focus:ring-2"
        />

        <button onClick={sendMessage} disabled={!text.trim()} className="bg-primary text-primary-foreground rounded-full px-6 py-3 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
