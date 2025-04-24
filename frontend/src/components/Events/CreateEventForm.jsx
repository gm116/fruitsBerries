import React, {useState} from "react";
import "./CreateEventForm.css";

const CreateEventForm = ({onSuccess}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [startDateTime, setStartDateTime] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const payload = {
            title,
            description,
            location,
            start_datetime: startDateTime,
        };

        const res = await fetch("http://localhost:8080/api/users/events/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            const data = await res.json();
            onSuccess && onSuccess(data);
        } else {
            alert("Ошибка при создании мероприятия");
        }
    };

    return (
        <form className="create-event-form" onSubmit={handleSubmit}>
            <h2>Создать мероприятие</h2>

            <label>
                Название:
                <input value={title} onChange={(e) => setTitle(e.target.value)} required/>
            </label>

            <label>
                Описание:
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>
            </label>

            <label>
                Локация:
                <input value={location} onChange={(e) => setLocation(e.target.value)}/>
            </label>

            <label>
                Дата и время начала:
                <input
                    type="datetime-local"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                    required
                />
            </label>

            <button type="submit">Создать</button>
        </form>
    );
};

export default CreateEventForm;