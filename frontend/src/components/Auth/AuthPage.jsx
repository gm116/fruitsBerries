import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./AuthPage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-tabs">
        <button
          className={`tab ${isLogin ? "active" : ""}`}
          onClick={() => setIsLogin(true)}
        >
          Вход
        </button>
        <button
          className={`tab ${!isLogin ? "active" : ""}`}
          onClick={() => setIsLogin(false)}
        >
          Регистрация
        </button>
      </div>
      <div className="auth-form">
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default AuthPage;