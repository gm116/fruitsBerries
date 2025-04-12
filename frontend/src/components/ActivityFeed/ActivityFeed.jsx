import React, {useState, useEffect} from "react";
import "./ActivityFeed.css";
import ActivityItem from "./ActivityItem";
import TreeForm from "./TreeForm";
import TreeCard from "./TreeCard";

const ActivityFeed = ({selectedTree, showAddTreeForm, setShowAddTreeForm, clickedCoords}) => {
    const [activities, setActivities] = useState([]);
    const [isFeedOpen, setFeedOpen] = useState(true);
    const [error, setError] = useState("");
    const [speciesList, setSpeciesList] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    const [plantData, setPlantData] = useState({
        name: "",
        species: "",
        latitude: "",
        longitude: "",
        image_url: "",
    });

    useEffect(() => {
        if (clickedCoords && showAddTreeForm) {
            const [lat, lon] = clickedCoords;
            setPlantData((prev) => ({
                ...prev,
                latitude: lat.toFixed(6),
                longitude: lon.toFixed(6),
            }));
        }
    }, [clickedCoords, showAddTreeForm]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/users/activity-feed/");
                if (!response.ok) throw new Error("Ошибка загрузки фида");
                const data = await response.json();
                setActivities((prev) => {
                    const newActivities = data.filter((item) => !prev.some((old) => old.id === item.id));
                    return [...newActivities, ...prev];
                });
            } catch (err) {
                setError(err.message);
            }
        };

        fetchActivities();
        const interval = setInterval(fetchActivities, 4000);
        return () => clearInterval(interval);
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
        setPlantData((prev) => ({...prev, [name]: value}));
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
                method: "POST",
                headers: {Authorization: `Bearer ${token}`},
                body: formData,
            });

            const data = await response.json();
            return response.ok ? data.image_url : null;
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
                setShowAddTreeForm(false);
            } else {
                alert(data);
            }
        } catch (error) {
            console.error("Ошибка добавления растения:", error);
        }
    };

    return (
        <div className={`activity-feed ${!isFeedOpen ? "closed" : ""}`}>
            <button
                className={`toggle-button ${isFeedOpen ? "open" : ""}`}
                onClick={toggleFeed}
                title={isFeedOpen ? "Скрыть панель" : "Показать панель"}
            >
                {isFeedOpen ? "←" : "→"}
            </button>

            {isFeedOpen && (
                <>
                    {showAddTreeForm ? (
                        <TreeForm
                            plantData={plantData}
                            speciesList={speciesList}
                            handleInputChange={handleInputChange}
                            handleImageChange={handleImageChange}
                            handleFormSubmit={handleFormSubmit}
                            onCancel={() => setShowAddTreeForm(false)}
                        />
                    ) : (
                        <div className="activity-list">
                            {selectedTree && <TreeCard tree={selectedTree}/>}

                            {error && <p className="error">{error}</p>}

                            {activities.length === 0 ? (
                                <p>Нет активности</p>
                            ) : (
                                activities.map((activity) => (
                                    <ActivityItem
                                        key={activity.id}
                                        action={activity.action}
                                        user={activity.user}
                                        datetime={activity.action_date}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ActivityFeed;