// src/App.js
import React from 'react';
import TreeList from './components/TreeList';
import TreeForm from './components/TreeForm';

function App() {
  return (
    <div className="App">
      <TreeForm />
      <TreeList />
    </div>
  );
}

export default App;
