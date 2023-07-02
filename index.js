const express = require("express");
const app = express();
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const { Server } = require("socket.io");

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/nnisarg.in-0001/privkey.pem"), // Path to your private key file
  cert: fs.readFileSync("/etc/letsencrypt/live/nnisarg.in-0001/fullchain.pem"), // Path to your certificate file
};

app.use(cors());

const server = https.createServer(options, app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User ${socket.id} joined Room ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(443, () => {
  console.log("SERVER RUNNING");
});
