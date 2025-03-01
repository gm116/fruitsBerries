import React, {useState, useEffect} from "react";
import "./ActivityFeed.css";

const ActivityFeed = ({selectedTree}) => {
    const [activities, setActivities] = useState([]);
    const [isFeedOpen, setFeedOpen] = useState(true);
    const [error, setError] = useState("");

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

    const toggleFeed = () => {
        setFeedOpen(!isFeedOpen);
    };

    return (
        <div className={`activity-feed ${!isFeedOpen ? "closed" : ""}`}>
            <button className={`toggle-button ${isFeedOpen ? "open" : ""}`} onClick={toggleFeed}>
                {isFeedOpen ? "Hide" : "Show"}
            </button>

            {isFeedOpen && (
                <>
                    {selectedTree && (
                        <div className="tree-info">
                            <h3>{selectedTree.name}</h3>
                            <p>
                                Тип: {selectedTree.species_name === "tree"
                                ? "Дерево"
                                : selectedTree.species_name === "bush"
                                    ? "Кустарник"
                                    : "Неизвестно"}
                            </p>
                            {selectedTree.image_url && <img src={selectedTree.image_url} alt={selectedTree.name}/>}
                        </div>
                    )}

                    {error && <p className="error">{error}</p>}

                    {activities.length === 0 ? (
                        <p>Нет активности</p>
                    ) : (
                        <ul>
                            {activities.map((activity) => (
                                <li key={activity.id}>
                                    <strong>{new Date(activity.action_date).toLocaleTimeString()}:</strong> {activity.action}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};

export default ActivityFeed;