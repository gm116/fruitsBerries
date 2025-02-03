import React, { useState } from "react";
import "./ProfileButton.css";

const ProfileButton = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [plantData, setPlantData] = useState({
    name: "",
    species: "",
    latitude: "",
    longitude: "",
    image_url: "",
  });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlantData({
      ...plantData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    alert(localStorage.getItem("token"))
    try {
      const response = await fetch("http://localhost:8080/api/plants/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(plantData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Plant added successfully:", data);
        setShowForm(false); // Скрыть форму после успешного добавления
      } else {
          alert(data)
        console.log("Error:", data);
      }
    } catch (error) {
      console.error("Error adding plant:", error);
    }
  };

  return (
    <>
      <button className="profile-button" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`profile-menu ${menuOpen ? "open" : ""}`}>
        <button>Мой профиль</button>
        <button onClick={toggleForm}>Добавить растение</button>
        <button>Выйти</button>
      </div>

      {showForm && (
        <form onSubmit={handleFormSubmit}>
          <h2>Добавить растение</h2>
          <label>
            Название:
            <input
              type="text"
              name="name"
              value={plantData.name}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Вид:
            <input
              type="text"
              name="species"
              value={plantData.species}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Широта:
            <input
              type="number"
              name="latitude"
              value={plantData.latitude}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Долгота:
            <input
              type="number"
              name="longitude"
              value={plantData.longitude}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Ссылка на изображение:
            <input
              type="url"
              name="image_url"
              value={plantData.image_url}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Добавить</button>
        </form>
      )}
    </>
  );
};

export default ProfileButton;