import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from'react';

function App() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    async function fetchCount() {
      try {
        const response = await fetch('/api/count');
        if (response.ok) {
          setCount(await response.json());
        }
      } catch (e) {
        console.log(e)
      }
    }

    fetchCount();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to guigui.
        </p>
        <p>
          Count: {count !== null ? count : 'Chargement...'} {/* Affiche un message pendant le chargement */}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
