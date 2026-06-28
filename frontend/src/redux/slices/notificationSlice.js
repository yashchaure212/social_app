import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getNotificationsApi,
    markReadApi,
} from "@/services/notificationService";

export const fetchNotifications = createAsyncThunk(
    "notification/fetchNotifications",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getNotificationsApi();
            return res.data.notifications;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const markReadThunk = createAsyncThunk(
    "notification/markRead",
    async (id, { rejectWithValue }) => {
        try {
            await markReadApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const notificationSlice = createSlice({
    name: "notification",

    initialState: {
        notifications: [],
        loading: false,
    },

    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload;
            })

            .addCase(markReadThunk.fulfilled, (state, action) => {
                const notification = state.notifications.find(
                    (n) => n._id === action.payload
                );

                if (notification) {
                    notification.read = true;
                }
            });
    },
});

export default notificationSlice.reducer;
export const { addNotification } =
    notificationSlice.actions;