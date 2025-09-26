import React, { useState, useEffect } from "react";
import AuthContainer from "./components/AuthContainer";
import ChatRoom from "./components/ChatRoom";
import "./App.css";
import "./ChatStyles.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when app starts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const response = await fetch("http://localhost:3000/api/verify", {
          credentials: "include",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData.success) {
            setUser(userData.user);
          }
        }
      } catch (error) {
        console.log("Not authenticated:", error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuth = (userData) => {
    setUser(userData.user);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    // Clear JWT token from localStorage
    localStorage.removeItem("jwt_token");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {user ? (
        <ChatRoom user={user} onLogout={handleLogout} />
      ) : (
        <AuthContainer onAuth={handleAuth} />
      )}
    </div>
  );
};

export default App;
