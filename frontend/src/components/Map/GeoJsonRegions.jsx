import React, { useEffect, useState } from "react";
import { GeoObject } from "@pbe/react-yandex-maps";

const GeoJsonRegions = ({ show }) => {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const fetchGeoJson = async () => {
      if (!show) {
        setFeatures([]);
        return;
      }

      try {
        const response = await fetch("/gadm41_RUS_1.json");
        const geojson = await response.json();
        setFeatures(geojson.features || []);
      } catch (err) {
        console.error("Ошибка при загрузке GeoJSON:", err);
      }
    };

    fetchGeoJson();
  }, [show]);

const swapCoordinates = (coords) => {
  if (!Array.isArray(coords)) return [];

  if (coords.length && Array.isArray(coords[0][0])) {
    return coords.map(ring => {
      if (!Array.isArray(ring)) return [];
      return ring.map(([lon, lat]) => {
        if (typeof lon !== "number" || typeof lat !== "number") {
          console.warn("Неверные координаты:", [lon, lat]);
          return [0, 0];
        }
        return [lat, lon];
      });
    });
  }

  return coords.map(([lon, lat]) => {
    if (typeof lon !== "number" || typeof lat !== "number") {
      console.warn("Неверные координаты:", [lon, lat]);
      return [0, 0];
    }
    return [lat, lon];
  });
};

  return (
    <>
      {features.map((feature, index) => {
        const geometry = feature.geometry;
        const coords =
          geometry.type === "Polygon"
            ? geometry.coordinates
            : geometry.type === "MultiPolygon"
              ? geometry.coordinates.flat()
              : null;

        if (!coords) return null;

        return (
          <GeoObject
            key={index}
            geometry={{
              type: "Polygon",
              coordinates: swapCoordinates(coords),
            }}
            properties={{
              hintContent: feature.properties.NAME_1,
            }}
            options={{
              fillColor: "rgba(0, 191, 255, 0.3)",
              strokeColor: "#0077be",
              strokeWidth: 2,
              strokeOpacity: 0.7,
            }}
          />
        );
      })}
    </>
  );
};

export default GeoJsonRegions;