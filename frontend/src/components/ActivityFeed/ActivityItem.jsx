import React from "react";
import "./ActivityItem.css";

const ActivityItem = ({ action, user, datetime }) => {
  const formattedTime = new Date(datetime).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const avatarUrl = user?.profile_picture
    ? `http://localhost:8080${user.profile_picture}`
    : `http://localhost:8080/media/avatars/default_avatar.png`;

  return (
    <div className="activity-item fade-in">
      <img src={avatarUrl} alt="аватар" className="avatar" />
      <div className="content">
        <p>
          <strong>{user?.username || "Неизвестный"}</strong> {action}
        </p>
        <span className="timestamp">{formattedTime}</span>
      </div>
    </div>
  );
};

export default ActivityItem;