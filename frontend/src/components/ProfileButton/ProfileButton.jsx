import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import "./ProfileButton.css";

const ProfileButton = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [plantData, setPlantData] = useState({
        name: "",
        species: "",
        latitude: "",
        longitude: "",
        image_url: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const toggleMenu = () => {
        if (isAuthenticated) {
            setMenuOpen(!menuOpen);
        } else {
            navigate("/auth");
        }
    };


    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const handleLogin = () => {
        navigate("/auth");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setMenuOpen(false);
        navigate("/auth");
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setPlantData({
            ...plantData,
            [name]: value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/trees/add/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(plantData),
            });
            const data = await response.json();
            if (response.ok) {
                console.log("Plant added successfully:", data);
                setShowForm(false);
            } else {
                alert(data);
                console.log("Error:", data);
            }
        } catch (error) {
            console.error("Error adding plant:", error);
        }
    };

    return (
        <>
            {isAuthenticated ? (
                <>
                    <button className="profile-button" onClick={toggleMenu}>
                        ☰
                    </button>
                    <div className={`profile-menu ${menuOpen ? "open" : ""}`}>
                        <button>Мой профиль</button>
                        <button onClick={toggleForm}>Добавить растение</button>
                        <button onClick={handleLogout}>Выйти</button>
                    </div>
                </>
            ) : (
                <button className="profile-button" onClick={handleLogin}>Войти</button>
            )}

            {showForm && (
                <form onSubmit={handleFormSubmit}>
                    <h2>Добавить растение</h2>
                    <label>
                        Название:
                        <input type="text" name="name" value={plantData.name} onChange={handleInputChange} required/>
                    </label>
                    <label>
                        Вид:
                        <input type="text" name="species" value={plantData.species} onChange={handleInputChange}
                               required/>
                    </label>
                    <label>
                        Широта:
                        <input type="number" name="latitude" value={plantData.latitude} onChange={handleInputChange}
                               required/>
                    </label>
                    <label>
                        Долгота:
                        <input type="number" name="longitude" value={plantData.longitude} onChange={handleInputChange}
                               required/>
                    </label>
                    <label>
                        Ссылка на изображение:
                        <input type="url" name="image_url" value={plantData.image_url} onChange={handleInputChange}/>
                    </label>
                    <button type="submit">Добавить</button>
                </form>
            )}
        </>
    );
};

export default ProfileButton;
