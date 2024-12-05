import React, { useState } from "react";
import "./ActivityFeed.css";

const activities = [
  { id: 1, type: "tree_added", message: "Добавлено новое дерево в парк", time: "10:30 AM" },
  { id: 2, type: "achievement_unlocked", message: "Получено достижение 'Плодовитый садовод'", time: "11:00 AM" },
  { id: 3, type: "profile_updated", message: "Обновлено фото профиля", time: "1:45 PM" }
];

const ActivityFeed = () => {
  const [isFeedOpen, setFeedOpen] = useState(true);

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
          {activities.map((activity) => (
            <li key={activity.id} className={activity.type}>
              <strong>{activity.time}:</strong> {activity.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityFeed;