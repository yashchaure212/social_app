import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getMessagesApi,
    sendMessageApi,
} from "@/services/messageServices";
import { fetchConversations } from "./conversationSlice";
import { markSeenApi } from "@/services/messageServices";

export const fetchMessages = createAsyncThunk(
    "chat/fetchMessages",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await getMessagesApi(userId);
            return res.data.messages;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const markSeenThunk = createAsyncThunk(
  "chat/markSeen",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await markSeenApi(userId);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data
      );
    }
  }
);

export const sendMessageThunk = createAsyncThunk(
    "chat/sendMessage",
    async ({ userId, message }, { rejectWithValue, dispatch }) => {
        try {
            const res = await sendMessageApi(userId, message);

            dispatch(fetchConversations());

            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const chatSlice = createSlice({
    name: "chat",

    initialState: {
        messages: [],
        loading: false,
        error: null,
    },

    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })

            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(sendMessageThunk.fulfilled, (state, action) => {
                state.messages.push(action.payload);
            })
    },
});

export default chatSlice.reducer;
export const { addMessage } = chatSlice.actions;