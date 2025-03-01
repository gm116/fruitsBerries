import React, {useState, useEffect} from "react";
import {YMaps, Map, Placemark} from "@pbe/react-yandex-maps";
import "./Map.css";
import {defaultMapConfig} from "./MapConfig";

const MapComponent = ({onTreeSelect}) => {
    const {center, zoom} = defaultMapConfig;
    const [trees, setTrees] = useState([]);

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

    return (
        <div className="map-container">
            <YMaps query={{apikey: process.env.REACT_APP_YMAPS_API_KEY}}>
                <Map defaultState={{center, zoom}} className="map">
                    {trees.map((tree) => (
                        <Placemark key={tree.id} geometry={[tree.latitude, tree.longitude]}
                                   onClick={() => onTreeSelect(tree)}/>
                    ))}
                </Map>
            </YMaps>
        </div>
    );
};

export default MapComponent;