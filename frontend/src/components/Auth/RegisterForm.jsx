import React from "react";
import "./AuthPage.css";

const RegisterForm = () => {
  const handleRegister = (e) => {
    e.preventDefault();
    // логика для регистрации
  };

  return (
    <form className="auth-form" onSubmit={handleRegister}>
      <h2>Регистрация</h2>
      <label>
        Email:
        <input type="email" required />
      </label>
      <label>
        Пароль:
        <input type="password" required />
      </label>
      <label>
        Повторите пароль:
        <input type="password" required />
      </label>
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default RegisterForm;