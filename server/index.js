// Require for server side, import for client side!
const express = require("express");
const socketio = require("socket.io");
// http is built in node module
const http = require("http");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server); // This is an instance of socketio

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
