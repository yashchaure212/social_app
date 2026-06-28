import Notification from "../models/notificationModel.js";

export const getNotifications =
    async (req, res) => {
        try {
            const notifications =
                await Notification.find({
                    receiver: req.id,
                })
                    .populate(
                        "sender",
                        "username profilePicture"
                    )
                    .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                notifications,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

export const getUnreadNotifications =
    async (req, res) => {
        try {
            const count =
                await Notification.countDocuments({
                    receiver: req.id,
                    read: false,
                });

            return res.status(200).json({
                success: true,
                count,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

export const markNotificationsRead = async (req, res) => {
  const { id } = req.params;

  await Notification.findByIdAndUpdate(id, {
    read: true,
  });

  return res.status(200).json({
    success: true,
  });
};