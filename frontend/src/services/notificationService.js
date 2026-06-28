import api from "../lib/axios";

export const getNotificationsApi = () => {
  return api.get("/notifications");
};

export const markReadApi = (id) => {
  return api.put(`/notifications/read/${id}`);
};