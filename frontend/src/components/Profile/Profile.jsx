import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const endpoint = id ? `/api/users/profile/?user_id=${id}` : `/api/users/profile/`;
      try {
        const res = await fetch(`http://localhost:8080${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserData(data);
        if (!id) setIsOwner(true);
      } catch (err) {
        console.error("Ошибка загрузки профиля:", err);
      }
    };
    fetchUser();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    navigate("/auth");
  };

const handleSubmitReview = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const formData = new FormData(e.target);
  const is_positive_raw = formData.get("is_positive");

  const payload = {
    to_user: id,
    is_positive: is_positive_raw === "true",
    comment: formData.get("comment"),
  };

  try {
    const res = await fetch("http://localhost:8080/api/users/leave-review/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Отзыв добавлен!");
      window.location.reload();
    } else {
      const error = await res.json();
      alert(error.detail || "Ошибка при добавлении отзыва");
    }
  } catch (err) {
    console.error("Ошибка отправки отзыва:", err);
    alert("Не удалось отправить отзыв.");
  }
};

  if (!userData) return <div className="user-profile-loading">Загрузка профиля...</div>;

  const avatarUrl = userData.profile_picture
    ? `http://localhost:8080${userData.profile_picture}`
    : `http://localhost:8080/media/avatars/default_avatar.png`;

  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        <img src={avatarUrl} alt="avatar" className="user-profile-avatar" />
        <div className="user-profile-details">
          <h2>{userData.username}</h2>
          <p className="user-profile-bio">Пользователь фрукты-ягоды</p>
          <div className="user-profile-rating">Рейтинг: {userData.rating} / 5</div>
          {isOwner && (
            <button className="user-profile-logout-btn" onClick={handleLogout}>
              Выйти из аккаунта
            </button>
          )}
        </div>
      </div>

      <div className="user-profile-content">
        <div className="user-profile-section">
          <h3>🎖 Достижения</h3>
          <div className="user-profile-achievement-list">
            {userData.achievements?.length ? (
              userData.achievements.map((ach) => (
                <div key={ach.id} className="user-profile-achievement-card">
                  <h4>{ach.name}</h4>
                  <p>{ach.description}</p>
                </div>
              ))
            ) : (
              <p>Пока нет достижений</p>
            )}
          </div>
        </div>

        <div className="user-profile-section">
          <h3>🌱 Добавленные растения</h3>
          <div className="user-profile-tree-list">
            {userData.trees?.length ? (
              userData.trees.map((tree) => (
                <div key={tree.id} className="user-profile-tree-card">
                  <img
                    src={
                      tree.image_url
                        ? `http://localhost:8080${tree.image_url}`
                        : `https://static-maps.yandex.ru/1.x/?ll=${tree.longitude},${tree.latitude}&z=17&l=sat&size=300,200`
                    }
                    alt="tree"
                  />
                  <h4>{tree.species_title}</h4>
                  <p className="user-profile-tree-coords">
                    📍 {tree.latitude}, {tree.longitude}
                  </p>
                </div>
              ))
            ) : (
              <p>Пока нет растений</p>
            )}
          </div>
        </div>

        <div className="user-profile-section">
          <h3>🗣 Отзывы</h3>
          <div className="user-profile-review-list">
            {userData.reviews?.length ? (
              userData.reviews.map((r) => (
                <div key={r.id} className={`review-card ${r.is_positive ? "positive" : "negative"}`}>
                  <strong>{r.is_positive ? "👍 Хорошо" : "👎 Плохо"}</strong>
                  {r.comment && <p>{r.comment}</p>}
                </div>
              ))
            ) : (
              <p>Пока отзывов нет</p>
            )}
          </div>
        </div>

        {!isOwner && (
          <div className="user-profile-section">
            <h3>💬 Оставить отзыв</h3>
            <form className="user-profile-review-form" onSubmit={handleSubmitReview}>
              <select name="is_positive" required>
                <option value="">Выберите</option>
                <option value="true">👍 Хорошо</option>
                <option value="false">👎 Плохо</option>
              </select>
              <textarea name="comment" placeholder="Комментарий (необязательно)" rows="3" />
              <button type="submit">Оставить отзыв</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;