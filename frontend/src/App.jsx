import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import MapComponent from "./components/Map/Map";
import AuthPage from "./components/Auth/AuthPage";
import ActivityFeed from "./components/ActivityFeed/ActivityFeed";
import Profile from "./components/Profile/Profile";
import {refreshTokenIfNeeded} from "./utils/tokenService";
import EventsPage from "./components/Events/EventsPage";
import ForgotPasswordPage from "./components/Auth/ForgotPasswordPage";

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

    const toggleRegions = () => {
        setShowRegions(prev => !prev);
    };

    useEffect(() => {
        refreshTokenIfNeeded();
        const interval = setInterval(refreshTokenIfNeeded, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Router>
            <div className="App">
                <Header
                    setShowAddTreeForm={handleCloseForm}
                    toggleRegions={toggleRegions}
                    regionsVisible={showRegions}
                />
                <Routes>
                    <Route path="/auth" element={<AuthPage/>}/>
                    <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
                    <Route path="/user" element={<Profile isOwnProfile={true}/>}/>
                    <Route path="/user/:id" element={<Profile isOwnProfile={false}/>}/>
                    <Route path="/events" element={<EventsPage/>}/>
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