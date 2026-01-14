const express = require("express");
const Chat = require("../models/chat.model");
const authenticatedUser = require("../authentication/auth");

const router = express.Router();

/* CREATE OR GET ONE-TO-ONE CHAT */
router.post("/", authenticatedUser, async (req, res) => {
  try {
    const { users } = req.body;

    if (!users) {
      return res.status(400).json({ message: "UserId is required" });
    }

    // Check existing chat
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: users },
    })
      .populate("users", "userName email")
      .populate("lastMessage");

    if (chat) return res.json(chat);

    // Create new chat
    const newChat = await Chat.create({
      users: users,
    });

    const fullChat = await Chat.findById(newChat._id).populate(
      "users",
      "userName email"
    );

    res.status(201).json(fullChat);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Chat creation failed", error });
  }
});

/* GET ALL CHATS FOR LOGGED-IN USER */
router.get("/get", authenticatedUser, async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $in: [req.user.id] },
    })
      .populate("users", "userName email")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "Chats not found", error });
  }
});

module.exports = router;
