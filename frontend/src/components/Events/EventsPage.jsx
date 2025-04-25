import React, {useEffect, useState} from "react";
import EventCard from "./EventCard";
import CreateEventForm from "./CreateEventForm";
import "./EventsPage.css";

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchUser = async () => {
            const res = await fetch("http://localhost:8080/api/users/profile/", {
                headers: {Authorization: `Bearer ${token}`},
            });
            const data = await res.json();
            setCurrentUserId(data.id);
        };

        const fetchEvents = async () => {
            const res = await fetch("http://localhost:8080/api/users/events/");
            const data = await res.json();
            setEvents(data);
        };

        if (token) {
            fetchUser();
            fetchEvents();
        }
    }, []);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    const handleEventCreated = (newEvent) => {
        setEvents((prev) => [newEvent, ...prev]);
        setShowForm(false);
        showToast("Мероприятие успешно создано!");
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/users/events/${id}/delete/`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            setEvents((prev) => prev.filter((e) => e.id !== id));
            showToast("Мероприятие удалено.");
        }
    };

    const handleLeave = async (id) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/users/events/${id}/leave/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            setEvents((prev) =>
                prev.map((e) =>
                    e.id === id
                        ? {...e, participants: e.participants.filter((p) => p.id !== currentUserId)}
                        : e
                )
            );
            showToast("Вы вышли из мероприятия.");
        }
    };

    const handleJoin = async (id) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/users/events/${id}/join/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            setEvents((prev) =>
                prev.map((e) =>
                    e.id === id
                        ? {...e, participants: [...e.participants, {id: currentUserId}]}
                        : e
                )
            );
            showToast("Вы присоединились к мероприятию!");
        }
    };

    return (
        <>
            <div className="events-page">
                <div className="events-container">
                    <h2>Эко-мероприятия</h2>

                    <div className="create-button-wrapper">
                        <button onClick={() => setShowForm(!showForm)}>
                            {showForm ? "Закрыть форму" : "Создать мероприятие"}
                        </button>
                    </div>

                    {showForm && <CreateEventForm onSuccess={handleEventCreated}/>}

                    <div className="event-list">
                        {events.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                currentUserId={currentUserId}
                                onDelete={handleDelete}
                                onLeave={handleLeave}
                                onJoin={handleJoin}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {toastMessage && (
                <div className="toast">
                    {toastMessage}
                </div>
            )}
        </>
    );
};

export default EventsPage;