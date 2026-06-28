import api from "../lib/axios";

export const getMessagesApi = async (userId) => {
  return api.get(`/messages/${userId}`);
};

export const sendMessageApi = async (userId, message) => {
  return api.post(`/messages/send/${userId}`, {
    message,
  });
};

export const markSeenApi = async (userId) => {
  return api.put(`/messages/seen/${userId}`);
};