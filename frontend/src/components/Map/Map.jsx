import React from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import "./Map.css";
import { defaultMapConfig } from "./MapConfig";

const MapComponent = () => {
  const { center, zoom } = defaultMapConfig;

  return (
    <div className="map-container">
      <YMaps query={{ apikey: process.env.REACT_APP_YMAPS_API_KEY }}>
        <Map defaultState={{ center, zoom }} className="map">
          {/* Example: Add a placemark */}
          <Placemark geometry={center} />
        </Map>
      </YMaps>
    </div>
  );
};

export default MapComponent;
