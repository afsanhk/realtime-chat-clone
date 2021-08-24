// Require for server side, import for client side!
const express = require("express");
const socketio = require("socket.io");
// http is built in node module
const http = require("http");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "http://localhost:3002" } }); // This is an instance of socketio, need to set up cors origin in case socket and server are not served by same port

// Run all socket code inside the io.on wrapper.
// Important to pass in socket here, this is unique to each connection.
io.on("connection", (socket) => {
  console.log("We have a new connection!");

  // Client emits a specific event, server does something on this event
  socket.on("join", ({ name, room }) => {
    console.log(name, room);
  });

  // Notice that this uses socket.on instead of io.on -> acting on just one socket connection
  socket.on("disconnect", () => {
    console.log("User has left!");
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
