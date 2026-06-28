import express from "express";

import isAuthenticated from "../middlewares/isAuthenticate.js";

import {
  sendMessage,
  getMessages,
  getConversations,
  markMessagesSeen
} from "../controller/messageController.js";

const router = express.Router();

router.post("/send/:id", isAuthenticated, sendMessage);
router.get("/conversations/all", isAuthenticated, getConversations);
router.get("/:id", isAuthenticated, getMessages);
router.put(
  "/seen/:id",
  isAuthenticated,
  markMessagesSeen
);

export default router;