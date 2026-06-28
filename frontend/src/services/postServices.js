import api from "../lib/axios";

export const createPost = async (formData) => {
  return api.post("/posts/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllPosts = async () => {
  return api.get("/posts/posts");
};

export const getSinglePostApi = async (id) => {
  return api.get(`/posts/post/${id}`);
};

export const likePostApi = async (postId) => {
  return api.put(`/posts/${postId}/like`, {});
};

export const addCommentApi = async (postId, text) => {
  return api.post(`/posts/${postId}/comment`, {
    text,
  });
};

export const getCommentsApi = async (postId) => {
  return api.get(`/posts/${postId}/comments`);
};

export const deleteCommentApi = async (commentId) => {
  return api.delete(`/posts/comment/${commentId}`);
};