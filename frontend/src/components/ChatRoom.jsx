import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Message from "./Message";
import MessageInput from "./MessageInput";
import AnonymousToggle from "./AnonymousToggle";
import GroupPicture from "../assets/Group Picture.jpg";
import AnonymeIcon from "../assets/anonyme icon.png";

const ChatRoom = ({ user, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [socket, setSocket] = useState(null);
  const [showAnonymousMessage, setShowAnonymousMessage] = useState(false);
  const messagesEndRef = useRef(null);

  // Load messages from server
  const loadMessages = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch("http://localhost:3000/api/messages/1", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessages(data.messages);
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([
        {
          id: 1,
          content: "Welcome to Fun Friday Group! 🎉",
          username: "System",
          isAnonymous: false,
          created_at: new Date(),
          userId: "system",
        },
      ]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");

    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
      auth: {
        token: token,
      },
    });

    setSocket(newSocket);
    loadMessages();

    newSocket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      newSocket.emit("join-room", { roomId: 1 });
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (content) => {
    if (socket && content.trim()) {
      const messageData = {
        content,
        isAnonymous,
        roomId: 1,
      };

      socket.emit("send-message", messageData);
    }
  };

  const handleAnonymousClick = () => {
    const newAnonymousState = !isAnonymous;
    setIsAnonymous(newAnonymousState);

    // Show notification message
    setShowAnonymousMessage(true);

    // Hide the notification after 3 seconds
    setTimeout(() => {
      setShowAnonymousMessage(false);
    }, 3000);
  };

  return (
    <div className="chat-room">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="header-left">
          <button className="back-button" onClick={onLogout}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>

          <div className="group-profile">
            <div className="group-avatar">
              <img
                src={GroupPicture}
                alt="Group Picture"
                className="group-image"
              />
              <div className="online-indicator"></div>
            </div>

            <div className="group-info">
              <h3 className="group-name">Fun Friday Group</h3>
              <p className="group-status">
                <span className="online-dot"></span>
                {socket ? "Online" : "Connecting..."}
              </p>
            </div>
          </div>
        </div>

        <div className="header-right">
          {/* Anonymous Toggle Button */}
          <button
            className={`anonymous-toggle-btn ${isAnonymous ? "active" : ""}`}
            onClick={handleAnonymousClick}
            title={
              isAnonymous
                ? "You're appearing as Anonymous"
                : "Click to go anonymous"
            }
          >
            <img src={AnonymeIcon} alt="Anonymous" className="anonyme-icon" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        <div className="messages-list">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isOwn={message.userId === user.id}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Anonymous Status Message */}
      {showAnonymousMessage && (
        <div className="anonymous-notification">
          <div className="anonymous-notification-content">
            <img
              src={AnonymeIcon}
              alt="Anonymous"
              className="anonyme-icon-small"
            />
            <span>
              {isAnonymous
                ? "Now you're appearing as Anonymous"
                : "Anonymous mode disabled"}
            </span>
          </div>
        </div>
      )}

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatRoom;
