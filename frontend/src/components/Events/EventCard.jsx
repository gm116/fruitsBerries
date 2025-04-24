import React, {useState} from "react";
import "./EventCard.css";

const EventCard = ({event, currentUserId, onJoin, onLeave, onDelete}) => {
    const [toast, setToast] = useState(null);

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

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const handleDelete = () => {
        if (window.confirm("Вы уверены, что хотите удалить мероприятие?")) {
            onDelete(event.id);
            showToast("Мероприятие удалено");
        }
    };

    const handleLeave = () => {
        onLeave(event.id);
        showToast("Вы покинули мероприятие");
    };

    const handleJoin = () => {
        onJoin(event.id);
        showToast("Вы присоединились к мероприятию");
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
                    <button onClick={handleDelete} className="event-btn delete">Удалить</button>
                ) : isParticipant ? (
                    <button onClick={handleLeave} className="event-btn leave">Выйти</button>
                ) : (
                    <button onClick={handleJoin} className="event-btn join">Присоединиться</button>
                )}
            </div>

            {toast && <div className="toast">{toast}</div>}
        </div>
    );
};

export default EventCard;