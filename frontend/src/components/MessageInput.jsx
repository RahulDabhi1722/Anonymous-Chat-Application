import React, { useState } from "react";
import ArrowIcon from "../assets/Arrow.png";

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-input-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="message-input"
          />
          <button type="button" className="attachment-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59722 21.9983 8.005 21.9983C6.41278 21.9983 4.88583 21.3658 3.76 20.24C2.63417 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63417 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42944 14.0938 2.00761 15.15 2.00761C16.2062 2.00761 17.2194 2.42944 17.97 3.18C18.7206 3.93056 19.1424 4.94378 19.1424 6C19.1424 7.05622 18.7206 8.06944 17.97 8.82L10.03 16.76C9.65444 17.1356 9.14222 17.3467 8.605 17.3467C8.06778 17.3467 7.55556 17.1356 7.18 16.76C6.80444 16.3844 6.59334 15.8722 6.59334 15.335C6.59334 14.7978 6.80444 14.2856 7.18 13.91L15.07 6.02"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <button type="submit" className="send-button">
          <img src={ArrowIcon} alt="Send" className="arrow-icon" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
