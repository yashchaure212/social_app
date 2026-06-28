import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getConversationsApi } from "@/services/conversationServices";

export const fetchConversations = createAsyncThunk(
  "conversation/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getConversationsApi();
      return res.data.conversations;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const conversationSlice = createSlice({
  name: "conversation",

  initialState: {
    conversations: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default conversationSlice.reducer;