import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { io, getReceiverSocketId } from "../socket/socket.js";
import Notification from "../models/notificationModel.js";


export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const notification =
      await Notification.create({
        receiver: receiverId,
        sender: senderId,
        type: "message",
        text: "sent you a message",
      });

    const populatedNotification =
      await Notification.findById(notification._id)
        .populate("sender", "username profilePicture");

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = await Message.create({
      conversationId: conversation._id,
      senderId,
      text: message,
    });

    conversation.lastMessage = newMessage._id;
    await conversation.save();

    const receiverSocketId =
      getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        "newMessage",
        newMessage
      );

      io.to(receiverSocketId).emit(
        "newNotification",
        populatedNotification
      );
    }

    return res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
    });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    const formattedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        const otherUserId = conversation.participants.find(
          (participant) => participant.toString() !== userId.toString()
        );

        const user = await User.findById(otherUserId).select(
          "username profilePicture bio"
        );

        const unreadCount = await Message.countDocuments({
          conversationId: conversation._id,
          senderId: otherUserId,
          seen: false,
        });

        return {
          _id: conversation._id,
          user,
          lastMessage: conversation.lastMessage?.text || "",
          updatedAt: conversation.updatedAt,
          unreadCount
        };
      })
    );

    return res.status(200).json({
      success: true,
      conversations: formattedConversations,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markMessagesSeen = async (req, res) => {
  try {
    const currentUserId = req.id;
    const otherUserId = req.params.id;

    let conversation = await Conversation.findOne({
      participants: {
        $all: [currentUserId, otherUserId],
      },
    });

    if (!conversation) {
      return res.status(200).json({
        success: true,
      });
    }

    await Message.updateMany(
      {
        conversationId: conversation._id,
        senderId: otherUserId,
        seen: false,
      },
      {
        seen: true,
      }
    );

    const senderSocketId =
      getReceiverSocketId(otherUserId);

    if (senderSocketId) {
      io.to(senderSocketId).emit(
        "messagesSeen",
        {
          conversationId: conversation._id,
        }
      );
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
    });
  }
};