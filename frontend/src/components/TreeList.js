import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TreeList = () => {
  const [trees, setTrees] = useState([]);

  useEffect(() => {
    // Получаем список деревьев с API
    axios.get('http://localhost:8080/api/trees/')
      .then(response => {
        setTrees(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the trees!', error);
      });
  }, []);

  return (
    <div>
      <h1>Tree List</h1>
      <ul>
        {trees.map(tree => (
          <li key={tree.id}>{tree.name} - {tree.age} years old</li>
        ))}
      </ul>
    </div>
  );
};

export default TreeList;