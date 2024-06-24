// src/App.js

import React from 'react';
import FileUpload from './FileUpload';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>File Sharing App</h1>
      </header>
      <main>
        <FileUpload />
      </main>
    </div>
  );
};

export default App;