import React, {useState} from "react";
import "./AuthPage.css";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/users/forgot-password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email}),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || "Письмо для восстановления отправлено.");
            } else {
                setError(data.detail || "Ошибка отправки запроса");
            }
        } catch (error) {
            setError("Ошибка связи с сервером");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <form className="auth-form" onSubmit={handleForgotPassword}>
                    <h2 className="form-title">Восстановление пароля</h2>

                    {message && <div className="alert success">{message}</div>}
                    {error && <div className="alert error">{error}</div>}

                    <label>
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>

                    <button type="submit" disabled={loading}>
                        {loading ? "Отправка..." : "Отправить ссылку"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;