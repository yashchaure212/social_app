import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getAllPosts,
    likePostApi,
    createPost,
    getSinglePostApi
} from "../../services/postServices";


export const addPost = createAsyncThunk(
    "post/add",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await createPost(formData);
            return res?.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to create post" });
        }
    }
);

export const fetchAllPost = createAsyncThunk(
    "post/allPost",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getAllPosts();
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to create post" })
        }
    }
)

export const toggleLikePost = createAsyncThunk(
    "post/like",
    async (postId, { rejectWithValue }) => {
        try {
            const res = await likePostApi(postId);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to like post" })
        }
    }
);

export const fetchSinglePost = createAsyncThunk(
    "post/fetchSinglePost",
    async (id, { rejectWithValue }) => {
        try {
            const res = await getSinglePostApi(id);
            return res.data.post;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);


const initialState = {
    loading: false,
    error: null,
    posts: [],
    commentsByPost: {},
    singlePost: null,
    singlePostLoading: false,
    singlePostError: null,
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // create post
            .addCase(addPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts.unshift(action.payload.post);
            })
            .addCase(addPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //all posts
            .addCase(fetchAllPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllPost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload.posts;
            })
            .addCase(fetchAllPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(toggleLikePost.fulfilled, (state, action) => {
                const updatedPost = action.payload?.post;

                if (!updatedPost) return;

                state.posts = state.posts.map((post) =>
                    post._id === updatedPost._id ? updatedPost : post
                );
            })
            // single post
            .addCase(fetchSinglePost.pending, (state) => {
                state.singlePostLoading = true;
                state.singlePostError = null;
            })

            .addCase(fetchSinglePost.fulfilled, (state, action) => {
                state.singlePostLoading = false;
                state.singlePost = action.payload;
            })

            .addCase(fetchSinglePost.rejected, (state, action) => {
                state.singlePostLoading = false;
                state.singlePostError = action.payload;
            })


    }
});

export default postSlice.reducer;