import React, {useEffect, useState} from "react";
import "./RegionInfoPanel.css";

const RegionInfoPanel = ({region, onClose}) => {
    const [crops, setCrops] = useState([]);

    useEffect(() => {
        if (!region) return;

        const fetchCrops = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trees/region-info/${region.id}/`);
                const data = await response.json();
                setCrops(data.crops || []);
            } catch (err) {
                console.error("Ошибка при загрузке культур региона:", err);
                setCrops([]);
            }
        };

        fetchCrops();
    }, [region]);

    if (!region) return null;

    return (<div className="region-panel">
        <div className="region-panel-header">
            <h4>{region.NAME_1}</h4>
            <button onClick={onClose} className="close-btn" title="Закрыть">×</button>
        </div>

        <div className="region-panel-body">
            <div className="region-panel-index">
                Индекс активности: <strong>{Math.round(region.intensity * 100)}%</strong>
            </div>

            <div className="region-panel-section">
                Сейчас плодоносят:
                {crops.length > 0 ? (<ul className="region-plant-list">
                    {crops.map((plant, idx) => (<li key={idx}>{plant}</li>))}
                </ul>) : (<div style={{fontSize: "13px", color: "#777", marginTop: "6px"}}>
                    Нет плодоносящих культур
                </div>)}
            </div>
        </div>
    </div>);
};

export default RegionInfoPanel;