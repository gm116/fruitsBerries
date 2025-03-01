import React, { useState } from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "./App.css";
import MapComponent from "./components/Map/Map";
import Sidebar from "./components/Sidebar";
import ProfileButton from "./components/ProfileButton/ProfileButton";
import AuthPage from "./components/Auth/AuthPage";
import ActivityFeed from "./components/ActivityFeed/ActivityFeed";

const App = () => {
    const [selectedTree, setSelectedTree] = useState(null);
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/auth"
                        element={<AuthPage/>}
                    />
                    <Route
                        path="/"
                        element={
                            <>
                                {/*<Sidebar/>*/}
                                <ProfileButton/>
                                <MapComponent onTreeSelect={setSelectedTree} />
                                <ActivityFeed selectedTree={selectedTree} />
                            </>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;