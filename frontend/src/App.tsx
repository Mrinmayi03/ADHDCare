// src/App.tsx
// import React, { type ReactNode, useContext } from 'react';
// import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import React, { type ReactNode, useContext } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';

import { AuthProvider, AuthContext } from './pages/AuthText';   // ← your context file
import { TimerProvider }          from './pages/TimerContext';
import { Layout }                 from './pages/Layout';
import Login from './pages/Login';

import HomePage        from './pages/HomePage';
import Tasks           from './pages/Tasks';
import MoodLogs        from './pages/MoodLogs';
import Medications     from './pages/Medications';
import MoodTrends      from './pages/MoodTrends';
import SentimentCharts from './pages/SentimentCharts';
import WordCloudView   from './pages/WordCloudView';
import SignUpPage from './pages/SignUpPage';


// ─── Typed PrivateRoute ───────────────────────────────────────────────────────
interface PrivateRouteProps {
  children: ReactNode;
}
function PrivateRoute({ children }: PrivateRouteProps) {
  const { token } = useContext(AuthContext);
  // if we have a token, render children; otherwise redirect
  return token ? <>{children}</> : <Navigate to="/login" />;
}
// ──────────────────────────────────────────────────────────────────────────────


// export default function App() {
//   return (
//     <AuthProvider>               {/* ← make auth state available */}
//       <TimerProvider>            {/* ← your existing timer context */}
//         <BrowserRouter>
          // <div className="max-w-2xl mx-auto p-4">
export default function App() {
   return (
     <AuthProvider>
       <TimerProvider>
         <div className="max-w-2xl mx-auto p-4">
            <nav className="flex justify-center gap-6 mb-8">
              <NavLink to="/" end        className={({isActive})=>isActive?'underline':''}>Home</NavLink>
              <NavLink to="/signup" className={({isActive})=>isActive?'underline':''}>
                Sign Up
              </NavLink>
              <NavLink to="/tasks"      className={({isActive})=>isActive?'underline':''}>Tasks</NavLink>
              <NavLink to="/moodlogs"   className={({isActive})=>isActive?'underline':''}>Mood</NavLink>
              <NavLink to="/medicationlogs"
                                        className={({isActive})=>isActive?'underline':''}>Medications</NavLink>
              <NavLink to="/trends"     className={({isActive})=>isActive?'underline':''}>Mood Trends</NavLink>
              <NavLink to="/sentiment-charts"
                                        className={({isActive})=>isActive?'underline':''}>Sentiment</NavLink>
              <NavLink to="/wordcloud"  className={({isActive})=>isActive?'underline':''}>Word Cloud</NavLink>
            </nav>

            <Routes>
              <Route element={<Layout />}>
                {/* public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login"  element={<Login />} />

                {/* protected */}
                <Route path="/tasks" element={
                  <PrivateRoute><Tasks /></PrivateRoute>
                }/>
                <Route path="/moodlogs" element={
                  <PrivateRoute><MoodLogs /></PrivateRoute>
                }/>
                <Route path="/medicationlogs" element={
                  <PrivateRoute><Medications /></PrivateRoute>
                }/>
                <Route path="/trends" element={
                  <PrivateRoute><MoodTrends /></PrivateRoute>
                }/>
                <Route path="/sentiment-charts" element={
                  <PrivateRoute><SentimentCharts /></PrivateRoute>
                }/>
                <Route path="/wordcloud" element={
                  <PrivateRoute><WordCloudView /></PrivateRoute>
                }/>

                <Route path="*" element={<p className="text-center">Select a page above.</p>} />
              </Route>
            </Routes>
          </div>
        </TimerProvider>
     </AuthProvider>
  );
}
