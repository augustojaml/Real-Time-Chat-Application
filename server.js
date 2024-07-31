const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

const actionsSocket = (socket) => {
  socket.on("newUser", (username) => {
    console.log("newUser", username);
    socket.broadcast.emit("update", `${username} joined conversation`);
  });

  socket.on("exitUser", (username) => {
    console.log("exitUser", username);
    socket.broadcast.emit("update", `${username} left the conversation`);
  });

  socket.on("chat", (message) => {
    console.log("chat", message);
    socket.broadcast.emit("chat", message);
  });
};

io.on("connection", actionsSocket);

server.listen(8000);
