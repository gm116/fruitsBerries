import React, { useState } from "react";
import "./ProfileButton.css";

const ProfileButton = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <button className="profile-button" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`profile-menu ${menuOpen ? "open" : ""}`}>
        <button>Мой профиль</button>
        <button>Мои места</button>
        <button>Выйти</button>
      </div>
    </>
  );
};

export default ProfileButton;