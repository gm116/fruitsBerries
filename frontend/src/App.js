import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MapComponent from "./components/Map/Map";
import Sidebar from "./components/Sidebar";
import ProfileButton from "./components/ProfileButton/ProfileButton";
import AuthPage from "./components/Auth/AuthPage";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/auth"
            element={<AuthPage />}
          />
          <Route
            path="/"
            element={
              <>
                <Sidebar />
                <ProfileButton />
                {/*<MapComponent />*/}
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;