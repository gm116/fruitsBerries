import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./AuthPage.css";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/users/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username, password}),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.access);
                localStorage.setItem("refresh", data.refresh);
                navigate("/");

            } else {
                setError("Неверный логин или пароль");
            }
        } catch (error) {
            setError("Ошибка связи с сервером");
        }
    };

    return (
        <form className="auth-form" onSubmit={handleLogin}>
            <h2 className="form-title">Вход</h2>

            {error && <div className="alert error">{error}</div>}

            <label>
                Логин
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </label>

            <label>
                Пароль
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>

            <div className="forgot-password" onClick={() => navigate("/forgot-password")}>
                Забыли пароль?
            </div>

            <button type="submit">Войти</button>
        </form>
    );
};

export default LoginForm;