// Require for server side, import for client side!
const express = require("express");
const socketio = require("socket.io");
// http is built in node module
const http = require("http");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server); // This is an instance of socketio

// Run all socket code inside the io.on wrapper.
// Important to pass in socket here, this is unique to each connection.
io.on("connection", (socket) => {
  console.log("We have a new connection!");
  // Notice that this uses socket.on instead of io.on -> acting on just one socket connection
  socket.on("disconnect", () => {
    console.log("User has left!");
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
