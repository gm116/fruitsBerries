import React from "react";
import "./TreeForm.css";

const TreeForm = ({
  plantData,
  speciesList,
  handleInputChange,
  handleImageChange,
  handleFormSubmit,
  onCancel
}) => {
  return (
    <div className="tree-form-container">
      <form onSubmit={handleFormSubmit} className="tree-form">
        <h2>Добавить растение</h2>

        <label>
          Вид:
          <select
            name="species"
            value={plantData.species}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Выберите вид</option>
            {speciesList.map((species) => (
              <option key={species.id} value={species.id}>
                {species.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Описание (необязательно):
          <input
            type="text"
            name="description"
            value={plantData.description}
            onChange={handleInputChange}
            placeholder="Например: возле школы №9"
          />
        </label>

        <label>
          Широта:
          <input
            type="text"
            name="latitude"
            value={plantData.latitude}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Долгота:
          <input
            type="text"
            name="longitude"
            value={plantData.longitude}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Фото:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        <div className="button-group">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Отмена
          </button>
          <button type="submit">Добавить</button>
        </div>
      </form>
    </div>
  );
};

export default TreeForm;