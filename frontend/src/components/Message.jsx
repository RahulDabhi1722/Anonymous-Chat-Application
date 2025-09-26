const Message = ({ message, isOwn }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getAvatar = () => {
    if (message.isAnonymous) {
      return (
        <div className="message-avatar anonymous">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
            <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.1" />
          </svg>
        </div>
      );
    }

    return (
      <div className="message-avatar">
        <div className="avatar-content">
          <span className="avatar-initial">
            {message.username?.charAt(0)?.toUpperCase() || "U"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`message ${isOwn ? "own" : "other"}`}>
      {!isOwn && (
        <div className="message-info">
          {getAvatar()}
          <div className="message-content">
            <div className="sender-name">
              {message.isAnonymous ? "Anonymous" : message.username}
            </div>
            <div className="message-bubble">
              <p>{message.content}</p>
              <span className="message-time">
                {formatTime(message.created_at)}
              </span>
            </div>
          </div>
        </div>
      )}

      {isOwn && (
        <div className="message-info own">
          <div className="message-content">
            <div className="message-bubble own">
              <p>{message.content}</p>
              <div className="message-meta">
                <span className="message-time">
                  {formatTime(message.created_at)}
                </span>
                <div className="message-status">
                  {/* Sent status */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    title="Sent"
                  >
                    <path d="M20 6L9 17L4 12" />
                  </svg>
                  {/* Delivered status */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    title="Delivered"
                  >
                    <path d="M20 6L9 17L4 12" />
                    <path d="M16 10L21 5L16 10" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
