const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const Connection = require("./connection/connection")
Connection()

const userRouter = require("./routes/user.route")

const messageRouter = require("./routes/message.routes")
const chatRouter = require("./routes/chat.route")
app.use("/user" , userRouter)
app.use("/message" , messageRouter)
app.use("/chat", chatRouter)


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

require("./socket/socket")(io);

server.listen(5000, (err) => {
    if(!err){
  console.log("Server running on port 5000");
    }else{
        console.log("server is not running")
    }
});
