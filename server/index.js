// Require for server side, import for client side!
const express = require("express");
const socketio = require("socket.io");
// http is built in node module
const http = require("http");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);

// This is an instance of socketio, need to set up cors origin in case socket and server are not served by same port
const io = socketio(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

// Run all socket code inside the io.on wrapper.
// Important to pass in socket here, this is unique to each connection.
io.on("connection", (socket) => {
  console.log("We have a new connection!");

  // Client emits a specific event, server does something on this event
  // The callback triggers some response after this event is handled -- such as error handling
  // The callback is defined within (i.e. supplied by) the socket.emit function
  socket.on("join", ({ name, room }, callback) => {
    // Because the addUser can only return error or user
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) {
      return callback(error);
    }

    // This joins the user in a room
    socket.join(user.room);

    // This is letting the user know they have joined. Note that in this case, the server emites some message that the client has to handle.
    socket.emit("message", {
      user: "Admin",
      text: `${user.name}, welcome to the room ${user.room}!`,
    });

    // Broadcast sends message to everyone except the user that sent it. .to needs a specific room specified.
    // Note it is still a message event - same as above
    // This is letting everyone else know the user has joined
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "Admin", text: `${user.name} has joined!` });

    io.to(user.room).emit("roomData", {
      user: user.room,
      users: getUsersInRoom(user.room),
    });

    // Not really necessary
    callback();
  });

  // Event handler for user generated messages - so we are waiting on sendMessage which will be emitted from the front end
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id); // This is from the socket declaration from above - specific for each client

    io.to(user.room).emit("message", { user: user.name, text: message }); // Take the message and push it out to everyone else in the room

    callback(); // This is so that we can do something after the message is sent on the front end
  });

  // Notice that this uses socket.on instead of io.on -> acting on just one socket connection
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left!`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
