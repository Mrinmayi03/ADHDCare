import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import api from './api/axios';


import { Routes, Route, NavLink } from 'react-router-dom'
import Tasks from './pages/Tasks'
import MoodLogs from './pages/MoodLogs'
import Medications from './pages/Medications'
import MoodTrends from './pages/MoodTrends';


function App() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <nav style={{ marginBottom: 20, display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <NavLink to="/tasks"   className={({isActive}) => isActive ? 'underline' : ''}>Tasks</NavLink>
        <NavLink to="/mood"    className={({isActive}) => isActive ? 'underline' : ''}>Mood</NavLink>
        <NavLink to="/medications" className={({isActive}) => isActive ? 'underline' : ''}>Medications</NavLink>
        <NavLink to="/trends" className={({isActive}) => isActive ? 'underline' : ''}>Mood Trends</NavLink>
      </nav>

      <Routes>
        <Route path="/tasks"       element={<Tasks />} />
        <Route path="/mood"        element={<MoodLogs />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/trends" element={<MoodTrends />} />
        <Route path="*"            element={<p>Select a page above.</p>} />
      </Routes>
    </div>
  )
}


export default App;

