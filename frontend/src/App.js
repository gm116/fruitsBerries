import React, {useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import MapComponent from "./components/Map/Map";
import AuthPage from "./components/Auth/AuthPage";
import ActivityFeed from "./components/ActivityFeed/ActivityFeed";

const App = () => {
    const [selectedTree, setSelectedTree] = useState(null);
    const [showAddTreeForm, setShowAddTreeForm] = useState(false);

    return (
        <Router>
            <div className="App">
                <Header setShowAddTreeForm={setShowAddTreeForm}/>
                <Routes>
                    <Route path="/auth" element={<AuthPage/>}/>
                    <Route
                        path="/"
                        element={
                            <>
                                <MapComponent onTreeSelect={setSelectedTree}/>
                                <ActivityFeed
                                    selectedTree={selectedTree}
                                    showAddTreeForm={showAddTreeForm}
                                    setShowAddTreeForm={setShowAddTreeForm}
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