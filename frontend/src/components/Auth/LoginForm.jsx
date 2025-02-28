import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const LoginForm = () => {
    const [username, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/users/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username: username, password}),
            });

            const data = await response.json();

            if (response.ok) {
                setError("Успешный вход!");
                // setToken(data.access);
                navigate("/");
                localStorage.setItem("token", data.access);
                // alert(localStorage.getItem("token"))
            } else {
                setError("Ошибка входа");
            }
        } catch (error) {
            setError("Ошибка связи с сервером");
        }
    };

    return (
        <form className="auth-form" onSubmit={handleLogin}>
            <h2>Вход</h2>
            {error && <p className="error">{error}</p>}
            <label>
                Логин:
                <input
                    type="username"
                    value={username}
                    onChange={(e) => setEmail(e.target.value)}
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
            <button type="submit">Войти</button>
        </form>
    );
};

export default LoginForm;