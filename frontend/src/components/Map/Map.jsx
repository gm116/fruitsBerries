import React, {useState, useEffect, useRef} from "react";
import {YMaps, Map, Placemark} from "@pbe/react-yandex-maps";
import "./Map.css";
import GeoJsonRegions from "./GeoJsonRegions";
import {defaultMapConfig} from "./MapConfig";
import RegionInfoPanel from "./RegionInfoPanel";

const MapComponent = ({
                          onTreeSelect,
                          onMapClick,
                          allowMapClick,
                          tempMarkerCoords,
                          showRegions,
                      }) => {
    const {center, zoom} = defaultMapConfig;
    const [trees, setTrees] = useState([]);
    const mapRef = useRef(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);

    useEffect(() => {
        const fetchTrees = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/trees/get-plants/");
                if (!response.ok) throw new Error("Ошибка загрузки деревьев");
                const data = await response.json();
                setTrees(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchTrees();
    }, []);

    const handleMapClick = (e) => {
        if (!allowMapClick) return;
        const coords = e.get("coords");
        onMapClick(coords);
    };

    const handlePlacemarkClick = (tree) => {
        onTreeSelect(tree);
        if (mapInstance) {
            const offsetLongitude = 0.0005 * tree.longitude;
            mapInstance.setCenter([tree.latitude, tree.longitude - offsetLongitude], 14, {
                duration: 400,
            });
        }
    };

    return (
        <div className="map-container">
            <YMaps query={{apikey: process.env.REACT_APP_YMAPS_API_KEY}}>
                <Map
                    defaultState={{center, zoom}}
                    className="map"
                    onClick={handleMapClick}
                    instanceRef={(ref) => {
                        mapRef.current = ref;
                        setMapInstance(ref);
                    }}
                >
                    {trees.map((tree) => (
                        <Placemark
                            key={tree.id}
                            geometry={[tree.latitude, tree.longitude]}
                            onClick={() => handlePlacemarkClick(tree)}
                        />
                    ))}

                    {allowMapClick && tempMarkerCoords && (
                        <Placemark
                            geometry={tempMarkerCoords}
                            options={{preset: "islands#greenDotIcon"}}
                        />
                    )}

                    <GeoJsonRegions
                        show={showRegions}
                        onRegionClick={setSelectedRegion}
                        selectedRegionId={selectedRegion?.id}
                    />
                </Map>
            </YMaps>

            <RegionInfoPanel
                region={selectedRegion}
                onClose={() => setSelectedRegion(null)}
            />
        </div>
    );
};

export default MapComponent;