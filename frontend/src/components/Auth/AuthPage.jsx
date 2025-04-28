import React, {useState} from "react";
import "./AuthPage.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-tabs">
                    <button
                        className={`tab ${isLogin ? "active" : ""}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Войти
                    </button>
                    <button
                        className={`tab ${!isLogin ? "active" : ""}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Регистрация
                    </button>
                </div>

                {isLogin ? <LoginForm/> : <RegisterForm/>}
            </div>
        </div>
    );
};

export default AuthPage;