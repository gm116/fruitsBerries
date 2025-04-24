import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

const Header = ({ setShowAddTreeForm, toggleRegions }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    navigate("/auth");
  };

  const isAuthPage = location.pathname === "/auth";

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/")}>
        фрукты-ягоды
      </div>
      <nav className="nav-links">
        <button onClick={() => navigate("/")}>Карта</button>

        {!isAuthPage && (
          <button onClick={toggleRegions}>Отобразить регионы</button>
        )}

        {isAuthenticated ? (
          <>
            <button onClick={() => navigate("/user")}>Профиль</button>
            <button onClick={() => navigate("/events")}>Мероприятия</button>
            <button className="add-plant-btn" onClick={() => setShowAddTreeForm(true)}>
              Добавить растение
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Выйти
            </button>
          </>
        ) : (
          !isAuthPage && (
            <button className="login-btn" onClick={() => navigate("/auth")}>
              Войти
            </button>
          )
        )}
      </nav>
    </header>
  );
};

export default Header;