import React, {useState} from "react";
import "./EditProfileModal.css";

const EditProfileModal = ({userData, onClose, onUpdate}) => {
    const [username, setUsername] = useState(userData.username || "");
    const [firstName, setFirstName] = useState(userData.first_name || "");
    const [lastName, setLastName] = useState(userData.last_name || "");
    const [profilePicture, setProfilePicture] = useState(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const token = localStorage.getItem("token");

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("username", username);
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        if (profilePicture) formData.append("profile_picture", profilePicture);

        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile/update/`, {
            method: "PUT",
            headers: {Authorization: `Bearer ${token}`},
            body: formData,
        });

        if (res.ok) {
            alert("Профиль обновлен");
            onUpdate();
            onClose();
        } else {
            alert("Ошибка при обновлении профиля");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile/change-password/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({old_password: oldPassword, new_password: newPassword}),
        });

        if (res.ok) {
            alert("Пароль изменен");
            setOldPassword("");
            setNewPassword("");
            onClose();
        } else {
            const data = await res.json();
            alert(data.detail || "Ошибка при смене пароля");
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal modal-animate">
                <h3>Редактирование профиля</h3>

                <form onSubmit={handleProfileSubmit} className="edit-profile-form">
                    <label>Имя пользователя:
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                    </label>
                    <label>Имя:
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                    </label>
                    <label>Фамилия:
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                    </label>
                    <label>Новая аватарка:
                        <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])}/>
                    </label>
                    <button type="submit" className="save-btn">Сохранить изменения</button>
                </form>

                <hr/>

                <form onSubmit={handlePasswordSubmit} className="edit-profile-form">
                    <label>Старый пароль:
                        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                    </label>
                    <label>Новый пароль:
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                    </label>
                    <button type="submit" className="save-btn">Сменить пароль</button>
                </form>

                <button className="close-modal-btn" onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
};

export default EditProfileModal;