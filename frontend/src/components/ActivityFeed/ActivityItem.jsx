import React from "react";
import "./ActivityItem.css";

const ActivityItem = ({ action, user, datetime }) => {
  const formattedTime = new Date(datetime).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const avatarUrl = user?.profile_picture
    ? `${process.env.REACT_APP_BACKEND_URL}${user.profile_picture}`
    : `${process.env.REACT_APP_BACKEND_URL}/media/avatars/default_avatar.png`;

  return (
    <div className="activity-item">
      <img src={avatarUrl} alt="аватар" className="avatar" />
      <div className="content">
        <span>
          <strong>{user?.username || "Неизвестный"}</strong> {action}
        </span>
        <span className="timestamp">{formattedTime}</span>
      </div>
    </div>
  );
};

export default ActivityItem;