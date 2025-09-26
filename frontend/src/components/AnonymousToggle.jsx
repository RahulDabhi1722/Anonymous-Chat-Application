import React from "react";

const AnonymousToggle = ({ isAnonymous, onToggle }) => {
  if (!isAnonymous) return null;

  return (
    <div className="anonymous-toggle">
      <div className="anonymous-indicator">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M8 14S9.5 16 12 16S16 14 16 14M9 9H9.01M15 9H15.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Now you're appearing as Anonymous</span>
        <button onClick={() => onToggle(false)} className="close-anonymous">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AnonymousToggle;
