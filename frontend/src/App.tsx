import { BrowserRouter } from "react-router-dom";
import { TimerProvider } from "./pages/TimerContext";
import { Layout } from "./pages/Layout";
// src/App.tsx
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

import HomePage from './pages/HomePage';
import Tasks from './pages/Tasks';
import MoodLogs from './pages/MoodLogs';
import Medications from './pages/Medications';
import MoodTrends from './pages/MoodTrends';
import SentimentCharts from './pages/SentimentCharts';
import WordCloudView from './pages/WordCloudView';

export default function App() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <nav className="flex justify-center gap-6 mb-8">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'underline' : ''}>
          Home
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? 'underline' : ''}>
          Tasks
        </NavLink>
        <NavLink to="/moodlogs" className={({ isActive }) => isActive ? 'underline' : ''}>
          Mood
        </NavLink>
        <NavLink to="/medicationlogs" className={({ isActive }) => isActive ? 'underline' : ''}>
          Medications
        </NavLink>
        <NavLink to="/trends" className={({ isActive }) => isActive ? 'underline' : ''}>
          Mood Trends
        </NavLink>
        <NavLink to="/sentiment-charts" className={({ isActive }) => isActive ? 'underline' : ''}>
          Sentiment
        </NavLink>
        <NavLink to="/wordcloud" className={({ isActive }) => isActive ? 'underline' : ''}>
          Word Cloud
        </NavLink>
      </nav>

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/moodlogs" element={<MoodLogs />} />
          <Route path="/medicationlogs" element={<Medications />} />
          <Route path="/trends" element={<MoodTrends />} />
          <Route path="/sentiment-charts" element={<SentimentCharts />} />
          <Route path="/wordcloud" element={<WordCloudView />} />
          <Route path="*" element={<p className="text-center">Select a page above.</p>} />
        </Route>
      </Routes>
    </div>
  );
}

