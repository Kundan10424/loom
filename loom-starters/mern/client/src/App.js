import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/')
      .then((res) => setMessage(res.data.message))
      .catch(() => setMessage('Could not reach the server'));
  }, []);

  return (
    <div className="App">
      <h1>Hello MERN Stack</h1>
      <p>{message || 'Loading...'}</p>
    </div>
  );
}
