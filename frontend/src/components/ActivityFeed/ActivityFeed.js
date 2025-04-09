import React, {useState, useEffect} from "react";
import "./ActivityFeed.css";

const ActivityFeed = ({
                          selectedTree, showAddTreeForm, setShowAddTreeForm, clickedCoords,
                      }) => {
    const [activities, setActivities] = useState([]);
    const [isFeedOpen, setFeedOpen] = useState(true);
    const [error, setError] = useState("");
    const [speciesList, setSpeciesList] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    const [plantData, setPlantData] = useState({
        name: "", species: "", latitude: "", longitude: "", image_url: "",
    });

    useEffect(() => {
        if (clickedCoords && showAddTreeForm) {
            const [lat, lon] = clickedCoords;
            setPlantData((prev) => ({
                ...prev, latitude: lat.toFixed(6), longitude: lon.toFixed(6),
            }));
        }
    }, [clickedCoords, showAddTreeForm]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/users/activity-feed/");
                if (!response.ok) throw new Error("Ошибка загрузки фида");
                const data = await response.json();
                setActivities(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchActivities();
    }, []);

    useEffect(() => {
        const fetchSpecies = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/trees/get_species/");
                if (!response.ok) throw new Error("Ошибка загрузки видов");
                const data = await response.json();
                setSpeciesList(data);
            } catch (err) {
                console.error("Ошибка загрузки видов:", err);
            }
        };
        fetchSpecies();
    }, []);

    const toggleFeed = () => setFeedOpen(!isFeedOpen);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setPlantData((prev) => ({
            ...prev, [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const uploadImage = async () => {
        if (!imageFile) return null;

        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/trees/upload-image/", {
                method: "POST", headers: {
                    Authorization: `Bearer ${token}`,
                }, body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                return data.image_url;
            } else {
                console.error("Ошибка при загрузке изображения:", data);
                return null;
            }
        } catch (error) {
            console.error("Ошибка загрузки изображения:", error);
            return null;
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Пользователь не авторизован! Пожалуйста, войдите в систему.");
            return;
        }

        let uploadedImageUrl = "";

        if (imageFile) {
            uploadedImageUrl = await uploadImage();
            if (!uploadedImageUrl) {
                alert("Не удалось загрузить изображение.");
                return;
            }
        }

        const payload = {
            ...plantData,
            ...(uploadedImageUrl ? {image_url: uploadedImageUrl} : {}),
        };

        try {
            const response = await fetch("http://localhost:8080/api/trees/add/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Растение добавлено:", data);
                setShowAddTreeForm(false);
            } else {
                alert(data);
                console.error("Ошибка:", data);
            }
        } catch (error) {
            console.error("Ошибка добавления растения:", error);
        }
    };

    return (<div className={`activity-feed ${!isFeedOpen ? "closed" : ""}`}>
        <button className={`toggle-button ${isFeedOpen ? "open" : ""}`} onClick={toggleFeed}>
            {isFeedOpen ? "Hide" : "Show"}
        </button>

        {isFeedOpen && (<>
            {showAddTreeForm ? (<div className="tree-form-container">
                <form onSubmit={handleFormSubmit} className="tree-form">
                    <h2>Добавить растение</h2>
                    <label>
                        Название:
                        <input type="text" name="name" value={plantData.name} onChange={handleInputChange}
                               required/>
                    </label>
                    <label>
                        Вид:
                        <select name="species" value={plantData.species} onChange={handleInputChange}
                                required>
                            <option value="" disabled>Выберите вид</option>
                            {speciesList.map((species) => (<option key={species.id} value={species.id}>
                                {species.name}
                            </option>))}
                        </select>
                    </label>
                    <label>
                        Широта:
                        <input type="number" name="latitude" value={plantData.latitude}
                               onChange={handleInputChange} required/>
                    </label>
                    <label>
                        Долгота:
                        <input type="number" name="longitude" value={plantData.longitude}
                               onChange={handleInputChange} required/>
                    </label>
                    <label>
                        Фото:
                        <input type="file" accept="image/*" onChange={handleImageChange}/>
                    </label>
                    <div className="button-group">
                        <button type="button" className="cancel-button"
                                onClick={() => setShowAddTreeForm(false)}>
                            Отмена
                        </button>
                        <button type="submit">Добавить</button>
                    </div>
                </form>
            </div>) : (<>
                {selectedTree && (
                    <div className="tree-info">
                        <h3>{selectedTree.name}</h3>
                        <p>Тип: {selectedTree.species_name === "tree" ? "Дерево" : selectedTree.species_name === "bush" ? "Кустарник" : "Неизвестно"}</p>

                        {selectedTree.image_url ? (
                            <img src={`http://localhost:8080${selectedTree.image_url}`} alt={selectedTree.name}/>
                        ) : (

                            <img
                                src={`https://static-maps.yandex.ru/1.x/?ll=${selectedTree.longitude},${selectedTree.latitude}&z=19&l=sat&size=450,450`}
                                alt="Спутниковый снимок"
                            />
                        )}
                    </div>
                )}

                {error && <p className="error">{error}</p>}

                {activities.length === 0 ? (<p>Нет активности</p>) : (<ul>
                    {activities.map((activity) => (<li key={activity.id}>
                        <strong>{new Date(activity.action_date).toLocaleTimeString()}:</strong> {activity.action}
                    </li>))}
                </ul>)}
            </>)}
        </>)}
    </div>);
};

export default ActivityFeed;