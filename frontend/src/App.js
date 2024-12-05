import "./App.css";
import MapComponent from "./components/Map/Map";
import ActivityFeed from "./components/ActivityFeed/ActivityFeed";


const App = () => {
  return (
    <div className="App">
      <ActivityFeed />
      {/*<MapComponent />*/}
    </div>
  );
};

export default App;