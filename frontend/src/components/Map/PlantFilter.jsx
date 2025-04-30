import React, {useEffect, useState} from "react";
import "./PlantFilter.css";

const PlantFilter = ({onFilterChange}) => {
    const [speciesList, setSpeciesList] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [selectedSpecies, setSelectedSpecies] = useState([]);

    useEffect(() => {
        const fetchSpecies = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trees/get_species/`);
                const data = await response.json();
                setSpeciesList(data);
                const allIds = data.map((s) => s.id);
                setSelectedSpecies(allIds);
                onFilterChange(allIds);
            } catch (err) {
                console.error("Ошибка при загрузке видов:", err);
            }
        };

        fetchSpecies();
    }, [onFilterChange]);

    const isAllSelected = selectedSpecies.length === speciesList.length;

    const toggleAll = () => {
        const allIds = speciesList.map((s) => s.id);
        if (isAllSelected) {
            setSelectedSpecies([]);
            onFilterChange([]);
        } else {
            setSelectedSpecies(allIds);
            onFilterChange(allIds);
        }
    };

    const toggleSpecies = (id) => {
        const updated = selectedSpecies.includes(id)
            ? selectedSpecies.filter((sid) => sid !== id)
            : [...selectedSpecies, id];
        setSelectedSpecies(updated);
        onFilterChange(updated);
    };

    return (
        <div className="plant-filter-wrapper">
            <div className="plant-filter-toggle" onClick={() => setExpanded(!expanded)}>
                Фильтр растений
            </div>

            {expanded && (
                <div className="plant-filter-panel">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={toggleAll}
                        />
                        <span className="custom-checkbox"/>
                        Отобразить все
                    </label>

                    <div className="checkbox-scroll">
                        {speciesList.map((species) => (
                            <label key={species.id} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={selectedSpecies.includes(species.id)}
                                    onChange={() => toggleSpecies(species.id)}
                                />
                                <span className="custom-checkbox"/>
                                {species.name}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlantFilter;