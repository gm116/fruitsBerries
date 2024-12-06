import "./App.css";
import MapComponent from "./components/Map/Map";
import Sidebar  from "./components/Sidebar";
import ProfileButton from "./components/ProfileButton/ProfileButton";


const App = () => {
  return (
    <div className="App">
      <Sidebar />
      <ProfileButton />
      <MapComponent />
    </div>
  );
};

export default App;