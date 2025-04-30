import React, {useState, useEffect} from "react";
import "./ActivityFeed.css";
import ActivityItem from "./ActivityItem";
import TreeForm from "./TreeForm";
import TreeCard from "./TreeCard";
import ToggleButton from "./ToggleButton";

const ActivityFeed = ({selectedTree, showAddTreeForm, setShowAddTreeForm, clickedCoords}) => {
    const [activities, setActivities] = useState([]);
    const [isFeedOpen, setFeedOpen] = useState(true);
    const [error, setError] = useState("");
    const [speciesList, setSpeciesList] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [plantData, setPlantData] = useState({
        description: "",
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
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/activity-feed/`);
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
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trees/get_species/`);
                if (!response.ok) throw new Error("Ошибка загрузки видов");
                const data = await response.json();
                setSpeciesList(data);
            } catch (err) {
                console.error("Ошибка загрузки видов:", err);
            }
        };
        fetchSpecies();
    }, []);

    useEffect(() => {
        if (message) {
            const timeout = setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 4000);
            return () => clearTimeout(timeout);
        }
    }, [message]);

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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trees/upload-image/`, {
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
        setMessage("");
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("Пожалуйста, войдите в систему.");
            setMessageType("error");
            return;
        }

        let uploadedImageUrl = "";
        if (imageFile) {
            uploadedImageUrl = await uploadImage();
            if (!uploadedImageUrl) {
                setMessage("Не удалось загрузить изображение.");
                setMessageType("error");
                return;
            }
        }

        const payload = {
            description: plantData.description,
            species: plantData.species,
            latitude: parseFloat(plantData.latitude),
            longitude: parseFloat(plantData.longitude),
            ...(uploadedImageUrl ? {image_url: uploadedImageUrl} : {}),
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trees/add/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) {
                setMessage(data.detail || data.error || "Ошибка при добавлении растения.");
                setMessageType("error");
                return;
            }

            setShowAddTreeForm(false);
            setMessage("Растение успешно добавлено!");
            setMessageType("success");
        } catch (error) {
            console.error("Ошибка добавления растения:", error);
            setMessage("Произошла ошибка при добавлении.");
            setMessageType("error");
        }
    };

    return (
        <>
            <div className={`activity-feed ${!isFeedOpen ? "closed" : ""}`}>
                {isFeedOpen && (
                    <>
                        {message && (
                            <div className={`alert ${messageType === "success" ? "alert-success" : "alert-error"}`}>
                                {message}
                            </div>
                        )}

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

            <ToggleButton isFeedOpen={isFeedOpen} toggleFeed={toggleFeed}/>
        </>
    );
};

export default ActivityFeed;