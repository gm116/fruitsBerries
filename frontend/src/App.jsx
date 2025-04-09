import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import MapComponent from "./components/Map/Map";
import AuthPage from "./components/Auth/AuthPage";
import ActivityFeed from "./components/ActivityFeed/ActivityFeed";

const App = () => {
    const [selectedTree, setSelectedTree] = useState(null);
    const [showAddTreeForm, setShowAddTreeForm] = useState(false);
    const [clickedCoords, setClickedCoords] = useState(null);
    const [tempMarkerCoords, setTempMarkerCoords] = useState(null);
    const [showRegions, setShowRegions] = useState(false);

    const allowMapClick = showAddTreeForm;

    const handleMapClick = (coords) => {
        setClickedCoords(coords);
        setTempMarkerCoords(coords);
    };

    const handleCloseForm = (value) => {
        setShowAddTreeForm(value);
        if (!value) {
            setTempMarkerCoords(null);
        }
    };

    return (
        <Router>
            <div className="App">
                <Header
                    setShowAddTreeForm={handleCloseForm}
                    toggleRegions={() => setShowRegions(prev => !prev)}
                />
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route
                        path="/"
                        element={
                            <>
                                <MapComponent
                                    onTreeSelect={setSelectedTree}
                                    allowMapClick={allowMapClick}
                                    onMapClick={handleMapClick}
                                    tempMarkerCoords={tempMarkerCoords}
                                    showRegions={showRegions}
                                />
                                <ActivityFeed
                                    selectedTree={selectedTree}
                                    showAddTreeForm={showAddTreeForm}
                                    setShowAddTreeForm={handleCloseForm}
                                    clickedCoords={clickedCoords}
                                />
                            </>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;