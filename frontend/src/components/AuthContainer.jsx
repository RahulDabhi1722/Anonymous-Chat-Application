import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthContainer = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  const handleAuth = (userData) => {
    onAuth(userData);
  };

  return (
    <div className="auth-wrapper">
      {isLogin ? (
        <Login onLogin={handleAuth} onSwitchToRegister={switchToRegister} />
      ) : (
        <Register onRegister={handleAuth} onSwitchToLogin={switchToLogin} />
      )}
    </div>
  );
};

export default AuthContainer;
