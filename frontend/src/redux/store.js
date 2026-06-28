import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlices";
import postReducer from "./slices/postSlice";
import commentReducer from "./slices/commentSlice"
import chatReducer from "./slices/chatSlice";
import conversationReducer from "./slices/conversationSlice";
import onlineUserReducer from "./slices/onlineUserSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        post: postReducer,
        comment: commentReducer,
        chat: chatReducer,
        conversation: conversationReducer,
        onlineUsers: onlineUserReducer,
        notification: notificationReducer,
    }
});