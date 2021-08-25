import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Messages.css";

import Message from "../Message/Message";

// We use react-scroll-to-bottom here. It auto scrolls to bottom when height of messages exceeds the height of the container.
const Messages = ({ messages, name }) => {
  return (
    <ScrollToBottom>
      {messages.map((message, i) => (
        <div key={i}>
          <Message message={message} name={name} />
        </div>
      ))}
    </ScrollToBottom>
  );
};

export default Messages;
