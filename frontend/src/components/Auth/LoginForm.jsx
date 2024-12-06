import React from "react";
import "./AuthPage.css";

const LoginForm = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    // логика для входа
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <h2>Вход</h2>
      <label>
        Email:
        <input type="email" required />
      </label>
      <label>
        Пароль:
        <input type="password" required />
      </label>
      <button type="submit">Войти</button>
    </form>
  );
};

export default LoginForm;