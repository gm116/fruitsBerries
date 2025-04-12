import React from "react";
import "./TreeCard.css";

const TreeCard = ({ tree }) => {
  if (!tree) return null;

  const createdDate = tree.created_at
    ? new Date(tree.created_at).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="tree-card">
      <div className="tree-card-image">
        <img
          src={
            tree.image_url
              ? `http://localhost:8080${tree.image_url}`
              : `https://static-maps.yandex.ru/1.x/?ll=${tree.longitude},${tree.latitude}&z=18&l=sat&size=650,450`
          }
          alt={tree.name}
        />
      </div>

      <div className="tree-card-content">
                <div className="tree-card-header">
                  <strong className="tree-name">{tree.species_title}</strong>
                  <span className="tree-type">
                    {tree.species_name === "tree"
                      ? "Дерево"
                      : tree.species_name === "bush"
                      ? "Кустарник"
                      : "Неизвестно"}
                  </span>
                </div>

        <div className="tree-card-description">
          {tree.description ? tree.description : "Описание отсутствует"}
        </div>

        <div className="tree-card-footer">
          <span className="tree-location">
            📍 {tree.latitude}, {tree.longitude}
          </span>
          {tree.user && (
            <span className="tree-user">
              👤 Добавил: {tree.user.username || `ID ${tree.user.id}`}
            </span>
          )}
          {createdDate && (
            <span className="tree-date">Добавлено: {createdDate}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreeCard;