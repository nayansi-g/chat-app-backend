const express = require("express");
const Message = require("../models/message.model");
const Chat = require("../models/chat.model");
const authenticatedUser = require("../authentication/auth");

const router = express.Router();

/* SEND MESSAGE */
router.post("/", authenticatedUser, async (req, res) => {
  try {
    const { content, chat } = req.body;

    if (!content || !chat) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // 1️⃣ Create message
    let message = await Message.create({
      sender: req.user.id,
      content,
      chat,
    });

    // 2️⃣ Populate sender & chat
    message = await message.populate("sender", "userName email");
    message = await message.populate("chat");
    message = await message.populate("chat.users", "userName email");

    // 3️⃣ Update last message in chat
    await Chat.findByIdAndUpdate(chat, {
      lastMessage: message._id,
    });

    res.status(201).json(message);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Message not sent", error });
  }
});


router.get("/get-by-chatid/:id",authenticatedUser ,async (req, res)=>{
  try{
    let allchats = await Message.find({chat: req.params.id});
    console.log(allchats, "All Chats from id:" + req.params.id )
    res.status(200).json(allchats)
  }catch(err){
    console.log(err);
    res.status(500).json({message: "Error"})
  }
})

module.exports = router;
