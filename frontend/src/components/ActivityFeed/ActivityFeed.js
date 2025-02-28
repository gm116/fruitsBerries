import React, { useState, useEffect } from "react";
import "./ActivityFeed.css";

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isFeedOpen, setFeedOpen] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/users/activity-feed/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Ошибка загрузки фида");
        }

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
      <button
        className={`toggle-button ${isFeedOpen ? "open" : ""}`}
        onClick={toggleFeed}
      >
        {isFeedOpen ? "Hide" : "Show"}
      </button>
      {isFeedOpen && (
        <ul>
          {error && <p className="error">{error}</p>}
          {activities.length === 0 ? (
            <p>Нет активности</p>
          ) : (
            activities.map((activity) => (
              <li key={activity.id}>
                <strong>{new Date(activity.action_date).toLocaleTimeString()}:</strong> {activity.action}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default ActivityFeed;