import { createSlice } from "@reduxjs/toolkit";

const onlineUserSlice = createSlice({
  name: "onlineUsers",

  initialState: {
    onlineUsers: [],
  },

  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setOnlineUsers } = onlineUserSlice.actions;

export default onlineUserSlice.reducer;