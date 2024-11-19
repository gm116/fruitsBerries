import React, { useState } from 'react';
import axios from 'axios';

const TreeForm = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const newTree = { name, age };

    axios.post('http://localhost:8080/api/trees/', newTree)
      .then(response => {
        console.log('Tree added:', response.data);
        setName('');
        setAge('');
      })
      .catch(error => {
        console.error('There was an error adding the tree!', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Tree name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Tree age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <button type="submit">Add Tree</button>
    </form>
  );
};

export default TreeForm;
