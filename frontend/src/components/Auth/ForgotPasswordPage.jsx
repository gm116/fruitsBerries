import React, {useState, useRef} from "react";
import "./AuthPage.css";

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const inputs = useRef([]);
    const passwordInputRef = useRef(null);

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/forgot-password/`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email}),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Код отправлен на почту. Введите код и новый пароль.");
                setStep(2);
            } else {
                setError(data.detail || "Ошибка отправки кода");
            }
        } catch (error) {
            setError("Ошибка связи с сервером");
        } finally {
            setLoading(false);
        }
    };

    const handleCodeChange = (e, index) => {
        const val = e.target.value.replace(/\D/g, "");

        if (val.length === 6) {
            const split = val.split("").slice(0, 6);
            setCode(split);
            inputs.current[5].focus();
            passwordInputRef.current?.focus();
            return;
        }

        if (val.length === 1) {
            const newCode = [...code];
            newCode[index] = val;
            setCode(newCode);

            if (index < 5) {
                inputs.current[index + 1]?.focus();
            } else {
                passwordInputRef.current?.focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (code[index]) {
                const newCode = [...code];
                newCode[index] = "";
                setCode(newCode);
            } else if (index > 0) {
                inputs.current[index - 1]?.focus();
                const newCode = [...code];
                newCode[index - 1] = "";
                setCode(newCode);
            }
        }
    };

    const handlePaste = (e) => {
        const pastedData = e.clipboardData.getData('Text').trim();
        if (/^\d{6}$/.test(pastedData)) {
            const split = pastedData.split("");
            setCode(split);
            inputs.current[5].focus();
            passwordInputRef.current?.focus();
            e.preventDefault();
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        const codeString = code.join("");

        if (codeString.length < 6) {
            setError("Введите полный код");
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Пароли не совпадают");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/reset-password/`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, code: codeString, new_password: newPassword}),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Пароль успешно изменён! Теперь можно войти.");
                setStep(3);
            } else {
                setError(data.detail || "Ошибка сброса пароля");
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
                {step === 1 && (
                    <form className="auth-form" onSubmit={handleSendEmail}>
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
                            {loading ? "Отправка..." : "Отправить код"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form className="auth-form" onSubmit={handleResetPassword}>
                        <h2 className="form-title">Введите код и новый пароль</h2>

                        {message && <div className="alert success">{message}</div>}
                        {error && <div className="alert error">{error}</div>}

                        <div className="code-input-wrapper" onPaste={handlePaste}>
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    className="code-input"
                                    value={digit}
                                    onChange={(e) => handleCodeChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    ref={(el) => (inputs.current[index] = el)}
                                    inputMode="numeric"
                                    onClick={(e) => e.target.setSelectionRange(1, 1)}
                                />
                            ))}
                        </div>

                        <label>
                            Новый пароль
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                ref={passwordInputRef}
                                required
                            />
                        </label>

                        <label>
                            Повторите пароль
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </label>

                        <button type="submit" disabled={loading}>
                            {loading ? "Сохранение..." : "Сохранить новый пароль"}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <div className="auth-form">
                        <h2 className="form-title">Готово</h2>
                        <div className="alert success">{message}</div>
                        <button onClick={() => window.location.href = "/auth"}>Перейти ко входу</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;