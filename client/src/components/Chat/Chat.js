import React, { useState, useEffect } from "react";
import queryString from "query-string"; // Used to retrieve data from URL
import io from "socket.io-client"; // Browser-side socket.io

import "./Chat.css";

import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

// Initialized outside of function
let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    // Takes the name and room entered on the Join page, destructures it and sets it to state
    const { name, room } = queryString.parse(location.search); // location comes from react-router as a prop

    socket = io(ENDPOINT); // We need to pass an endpoint to the server (hosted on localhost:5000)

    setName(name);
    setRoom(room);

    // You can emit events from clientside to the server side -- you can defined callbacks here to be used in the server-side. Mostly for error handling after this event has happened!
    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    // Cleanup must be a function
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  // Listens for messages and uses the messages state to track history
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]); // No mutation of state
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [messages, users]);

  // Function to send messages
  const sendMessage = (event) => {
    event.preventDefault(); // Very important so that a page refresh doesn't happen

    if (message) {
      socket.emit("sendMessage", message, () => setMessage("")); // This callback clears the input
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
