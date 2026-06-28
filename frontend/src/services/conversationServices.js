import api from "../lib/axios";

export const getConversationsApi = async () => {
  return api.get("/messages/conversations/all");
};