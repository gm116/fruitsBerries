import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

const Header = ({ setShowAddTreeForm }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem("token"));
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/auth");
    };

    return (
        <header className="header">
            <div className="logo" onClick={() => navigate("/")}>фрукты-ягоды</div>
            <nav className="nav-links">
                <button onClick={() => navigate("/")}>Карта</button>
                <button onClick={() => navigate("/achievements")}>Достижения</button>
                {isAuthenticated ? (
                    <>
                        <button onClick={() => navigate("/profile")}>Профиль</button>
                        <button className="add-plant-btn" onClick={() => setShowAddTreeForm(true)}>
                            Добавить растение
                        </button>
                        <button className="logout-btn" onClick={handleLogout}>Выйти</button>
                    </>
                ) : (
                    <button className="login-btn" onClick={() => navigate("/auth")}>Войти</button>
                )}
            </nav>
        </header>
    );
};

export default Header;