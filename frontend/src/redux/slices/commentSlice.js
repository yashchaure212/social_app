import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  addCommentApi,
  getCommentsApi,
  deleteCommentApi,
} from "../../services/postServices";

// ================= ADD COMMENT =================

export const addComment = createAsyncThunk(
  "comment/add",
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const res = await addCommentApi(postId, text);

      return res.data.comment;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// ================= GET COMMENTS =================

export const getComments = createAsyncThunk(
  "comment/get",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await getCommentsApi(postId);

      return res.data.comments;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// ================= DELETE COMMENT =================

export const deleteComment = createAsyncThunk(
  "comment/delete",
  async (commentId, { rejectWithValue }) => {
    try {
      await deleteCommentApi(commentId);

      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// ================= INITIAL STATE =================

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

// ================= SLICE =================

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ===== GET COMMENTS =====

      .addCase(getComments.pending, (state) => {
        state.loading = true;
      })

      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })

      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== ADD COMMENT =====

      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })

      // ===== DELETE COMMENT =====

      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
      });
  },
});

export default commentSlice.reducer;