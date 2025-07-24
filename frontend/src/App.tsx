import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import api from './api/axios';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Tasks from './pages/Tasks';
import MoodLog from './pages/MoodLogs';
import Medications from './pages/Medications';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Tasks</Link> | <Link to="/mood">Mood</Link> | <Link to="/medications">Medications</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Tasks />} />
        <Route path="/mood" element={<MoodLog />} />
        <Route path="/medications" element={<Medications />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

