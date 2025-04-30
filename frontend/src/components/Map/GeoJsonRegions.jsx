import React, {useEffect, useState} from "react";
import {GeoObject} from "@pbe/react-yandex-maps";

const GeoJsonRegions = ({show, onRegionClick, selectedRegionId, allowMapClick}) => {
    const [features, setFeatures] = useState([]);

    useEffect(() => {
        const fetchRegions = async () => {
            if (!show) {
                setFeatures([]);
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}0/api/trees/heatmap/`);
                const regions = await response.json();
                const converted = regions.map(region => ({
                    geometry: region.geometry,
                    properties: {
                        NAME_1: region.name,
                        intensity: region.intensity,
                        id: region.id,
                    },
                }));
                setFeatures(converted);
            } catch (err) {
                console.error("Ошибка при загрузке регионов:", err);
            }
        };

        fetchRegions();
    }, [show]);

    const swapCoordinates = (coords) => {
        if (!Array.isArray(coords)) return [];
        if (coords.length && Array.isArray(coords[0][0])) {
            return coords.map(ring => ring.map(([lon, lat]) => [lat, lon]));
        }
        return coords.map(([lon, lat]) => [lat, lon]);
    };

    const getColorByIntensity = (value) => {
        const score = value * 392;

        if (score >= 360) return "rgba(255,0,0,0.5)";
        if (score >= 320) return "rgba(255,69,0,0.5)";
        if (score >= 280) return "rgba(255,140,0,0.5)";
        if (score >= 240) return "rgba(255,215,0,0.5)";
        if (score >= 200) return "rgba(200,255,0,0.5)";
        if (score >= 160) return "rgba(30,144,255,0.5)";
        if (score >= 120) return "rgba(65,105,225,0.5)";
        if (score >= 60) return "rgba(25,25,112,0.5)";
        return "rgba(15,15,70,0.5)";
    };
    return (
        <>
            {features.map((feature, index) => {
                const geometry = feature.geometry;
                const coords = geometry.type === "Polygon"
                    ? geometry.coordinates
                    : geometry.type === "MultiPolygon"
                        ? geometry.coordinates.flat()
                        : null;

                if (!coords) return null;

                const intensity = feature.properties.intensity || 0;
                const isSelected = selectedRegionId === feature.properties.id;

                return (
                    <GeoObject
                        key={index}
                        geometry={{
                            type: "Polygon",
                            coordinates: swapCoordinates(coords),
                        }}
                        properties={{
                            hintContent: `${feature.properties.NAME_1} — индекс: ${Math.round(intensity * 100)}%`,
                        }}
                        options={{
                            fillColor: getColorByIntensity(intensity),
                            strokeColor: isSelected ? "#ff9900" : "#000000",
                            strokeWidth: isSelected ? 3 : 1,
                            strokeOpacity: 0.7,
                            interactivityModel: allowMapClick ? "default#transparent" : "default#geoObject",
                        }}
                        onClick={() => !allowMapClick && onRegionClick && onRegionClick(feature.properties)}
                    />
                );
            })}
        </>
    );
};

export default GeoJsonRegions;