import express from "express";
import isAuthenticated from "../middlewares/isAuthenticate.js";

import {
  getNotifications,
  getUnreadNotifications,
  markNotificationsRead,
} from "../controller/notificationController.js";

const router = express.Router();

router.get(
  "/",
  isAuthenticated,
  getNotifications
);

router.get(
  "/unread",
  isAuthenticated,
  getUnreadNotifications
);

router.put(
  "/read/:id",
  isAuthenticated,
  markNotificationsRead
);

export default router;