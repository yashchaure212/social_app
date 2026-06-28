import api from "../lib/axios";

export const fetchMyProfile = async () => {
  return api.get("/auth/me");
};

export const getUserProfile = async (id) => {
  return api.get(`/auth/profile/${id}`);
};

export const followUser = async (id) => {
  return api.post(`/auth/follow/${id}`, {});
};

export const unfollowUser = async (id) => {
  return api.post(`/auth/unfollow/${id}`, {});
};

export const searchUsersApi = async (query) => {
  return api.get(`/auth/search?query=${query}`)
};

export const getSuggestedUsersApi =
  async () => {
    return api.get(
      "/auth/suggested"
    );
  };