import React from "react";
import "./EventCard.css";

const EventCard = ({event, currentUserId, onJoin, onLeave, onDelete}) => {
    const isCreator = event.created_by?.id === currentUserId;
    const isParticipant = event.participants?.some((p) => p.id === currentUserId);

    const formatDate = (dt) => {
        const date = new Date(dt);
        if (isNaN(date)) return "Дата не указана";
        return date.toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="event-card">
            <div className="event-card-content">
                <h4>{event.title}</h4>
                <p>{event.description}</p>
                <p><strong>Где:</strong> {event.location}</p>
                <p><strong>Когда:</strong> {formatDate(event.start_datetime)}</p>
            </div>

            <div className="event-card-footer">
                {isCreator ? (
                    <button onClick={() => onDelete(event.id)} className="event-btn delete">
                        Удалить
                    </button>
                ) : isParticipant ? (
                    <button onClick={() => onLeave(event.id)} className="event-btn leave">
                        Выйти
                    </button>
                ) : (
                    <button onClick={() => onJoin(event.id)} className="event-btn join">
                        Присоединиться
                    </button>
                )}
            </div>
        </div>
    );
};

export default EventCard;