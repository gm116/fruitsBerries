import React, { useState } from "react";
import "./AuthPage.css";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // Добавляем состояние для email
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }), // Добавляем email в запрос
      });

      const data = await response.json();

      if (response.ok) {
        setError(data.message || "Успешная регистрация");
      } else {
        setError(data.message || "Ошибка регистрации");
      }
    } catch (error) {
      setError("Ошибка связи с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleRegister}>
      <h2>Регистрация</h2>
      {error && <p className="error">{error}</p>}
      <label>
        Логин:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Обрабатываем ввод email
          required
        />
      </label>
      <label>
        Пароль:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <label>
        Повторите пароль:
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Загрузка..." : "Зарегистрироваться"}
      </button>
    </form>
  );
};

export default RegisterForm;