import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

const Header = ({ setShowAddTreeForm, toggleRegions, regionsVisible }) => {
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
  const isMapPage = location.pathname === "/";
  const isEventsPage = location.pathname === "/events";
  const isProfilePage = location.pathname.startsWith("/user");

  const getButtonClass = (active) => active ? "nav-button active" : "nav-button";

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/")}>
        фрукты-ягоды
      </div>
      <nav className="nav-links">
        {!isMapPage && (
          <button className={getButtonClass(isMapPage)} onClick={() => navigate("/")}>
            Карта
          </button>
        )}

        {isMapPage && (
          <>
            <button className="nav-button" onClick={toggleRegions}>
              {regionsVisible ? "Скрыть регионы" : "Отобразить регионы"}
            </button>
            {isAuthenticated && (
              <button className="add-plant-btn" onClick={() => setShowAddTreeForm(true)}>
                Добавить растение
              </button>
            )}
          </>
        )}

        {isAuthenticated ? (
          <>
            <button className={getButtonClass(isProfilePage)} onClick={() => navigate("/user")}>
              Профиль
            </button>
            <button className={getButtonClass(isEventsPage)} onClick={() => navigate("/events")}>
              Мероприятия
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