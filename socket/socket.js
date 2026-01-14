const Chat = require("../models/chat.model");
module.exports = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Not authorized"));

    const jwt = require("jsonwebtoken");
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.userId);


    socket.join(socket.userId);

    socket.on("new-message", async (message) => {
      const chat = await Chat.findOne({_id: message.chat}) ;
      if (!chat.users) return;
      chat.users.forEach((user) => {
        if (user._id.toString() === socket.userId) return;
        socket.to(user._id.toString()).emit("message-received", message);
      });
    });

    socket.on("new-chat-initiated", async(chat)=>{
      console.log(chat, "New Chat INitiated")
      try{
        let newChat =  await Chat.create({ users: chat.users, isGroupChat: chat.isGroupChhat })
        newChat.users.forEach((user) => {
        if (user._id.toString() === socket.userId) return;
        socket.to(user._id.toString()).emit("new-chat-created");
      });
       console.log("New CHat Created")
      }catch(Err){
        console.log(Err);
      }
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId);
    });
  });
};
