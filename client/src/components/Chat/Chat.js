import React, { useState, useEffect } from "react";
import queryString from "query-string"; // Used to retrieve data from URL
import io from "socket.io-client"; // Browser-side socket.io

import "./Chat.css";

// Initialized outside of function
let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    // Takes the name and room entered on the Join page, destructures it and sets it to state
    const { name, room } = queryString.parse(location.search); // location comes from react-router as a prop

    socket = io(ENDPOINT); // We need to pass an endpoint to the server (hosted on localhost:5000)

    setName(name);
    setRoom(room);

    // You can emit events from clientside to the server side -- you can defined callbacks here to be used in the server-side. Mostly for error handling after this event has happened!
    socket.emit("join", { name, room }, () => {});

    // Cleanup must be a function
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  return <h1>Chat</h1>;
};

export default Chat;
