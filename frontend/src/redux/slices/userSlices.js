import {
  getUserProfile,
  followUser,
  unfollowUser,
  searchUsersApi,
  getSuggestedUsersApi
} from "@/services/userServices";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getUserProfile(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const followUserThunk = createAsyncThunk(
  "user/followUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await followUser(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to follow user" });
    }
  }
);

export const unfollowUserThunk = createAsyncThunk(
  "user/unfollowUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await unfollowUser(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to unfollow user" });
    }
  }
);

export const searchUsersThunk = createAsyncThunk(
  "user/searchUsers",
  async (query, { rejectWithValue }) => {
    try {
      const res = await searchUsersApi(query);

      return res.data.users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Search failed",
        }
      );
    }
  }
);

export const fetchSuggestedUsers = createAsyncThunk(
  "user/fetchSuggestedUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res =
        await getSuggestedUsersApi();

      return res.data.users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data
      );
    }
  }
);

const initialState = {
  user: null,
  userProfile: null,

  loadingMyProfile: false,
  loadingUserProfile: false,

  loadingFollow: false,
  loadingUnfollow: false,

  errorMyProfile: null,
  errorUserProfile: null,
  errorFollow: null,
  errorUnfollow: null,

  searchResults: [],
  loadingSearch: false,
  errorSearch: null,

  suggestedUsers: [],
  loadingSuggested: false,
};

// ======================= SLICE =======================

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.userProfile = null;
      state.errorUserProfile = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ================= USER PROFILE =================
      .addCase(fetchUserProfile.pending, (state) => {
        state.loadingUserProfile = true;
        state.userProfile = null;
        state.errorUserProfile = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loadingUserProfile = false;
        state.userProfile = action.payload?.user;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loadingUserProfile = false;
        state.errorUserProfile = action.payload;
      })

      // ================= FOLLOW =================
      .addCase(followUserThunk.pending, (state) => {
        state.loadingFollow = true;
      })

.addCase(followUserThunk.fulfilled, (state, action) => {
  state.loadingFollow = false;

  if (state.userProfile) {
    state.userProfile.following = action.payload.user.following;
    state.userProfile.followers = action.payload.user.followers;
  }
})

      .addCase(followUserThunk.rejected, (state, action) => {
        state.loadingFollow = false;
        state.errorFollow = action.payload;
      })

      // ================= UNFOLLOW =================
      .addCase(unfollowUserThunk.pending, (state) => {
        state.loadingUnfollow = true;
      })

.addCase(unfollowUserThunk.fulfilled, (state, action) => {
  state.loadingUnfollow = false;

  if (state.userProfile) {
    state.userProfile.following = action.payload.user.following;
    state.userProfile.followers = action.payload.user.followers;
  }
})

      .addCase(unfollowUserThunk.rejected, (state, action) => {
        state.loadingUnfollow = false;
        state.errorUnfollow = action.payload;
      })
      // SEARCH USERS
      .addCase(searchUsersThunk.pending, (state) => {
        state.loadingSearch = true;
        state.errorSearch = null;
      })

      .addCase(searchUsersThunk.fulfilled, (state, action) => {
        state.loadingSearch = false;
        state.searchResults = action.payload;
      })

      .addCase(searchUsersThunk.rejected, (state, action) => {
        state.loadingSearch = false;
        state.errorSearch = action.payload;
      })

      .addCase(
        fetchSuggestedUsers.pending,
        (state) => {
          state.loadingSuggested = true;
        }
      )

      .addCase(
        fetchSuggestedUsers.fulfilled,
        (state, action) => {
          state.loadingSuggested = false;
          state.suggestedUsers =
            action.payload;
        }
      )

      .addCase(
        fetchSuggestedUsers.rejected,
        (state) => {
          state.loadingSuggested = false;
        }
      )
  },
});

export const { clearUserProfile } = userSlice.actions;
export default userSlice.reducer;