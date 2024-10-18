import Conversation from "../Models/conversationModel.js";
import Message from "../Models/messageModel.js";
import { getReceiverSocketId, io } from "../Socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params; // Get receiverId from params
    const senderId = req.user._id; // Get senderId from user

    // Find or create conversation between sender and receiver
    let chats = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!chats) {
      chats = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      conversationId: chats._id,
    });

    // Save the message and update the conversation
    if (newMessage) {
      chats.messages.push(newMessage._id);
    }

    await Promise.all([chats.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Return the new message
    res.status(201).send(newMessage);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
    console.log(error);
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const chats = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!chats) return res.status(200).send([]);

    const message = chats.messages;
    res.status(200).send(message);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
    console.log(error);
  }
};
