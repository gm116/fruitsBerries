import "./App.css";
import MapComponent from "./components/Map/Map";
import Sidebar  from "./components/Sidebar";


const App = () => {
  return (
    <div className="App">
      <Sidebar />
      <MapComponent />
    </div>
  );
};

export default App;