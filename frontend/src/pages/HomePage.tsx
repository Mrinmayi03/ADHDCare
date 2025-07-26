// src/pages/HomePage.tsx
import React from "react";
import { useTimer } from "../pages/TimerContext";

export default function HomePage() {
  const {
    focusMinutes,
    breakMinutes,
    secondsLeft,
    mode,
    isRunning,
    setFocusMinutes,
    setBreakMinutes,
    start,
    pause,
    reset,
  } = useTimer();

  // format mm:ss
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const focusOptions = [5 , 15, 20, 25, 30, 45, 60];
  const breakOptions = [5, 10, 15];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl text-pink-700 font-bold">
            ⚡ NeuroNest
        </h1>
        <p className="mt-8 text-lg text-orange-600 max-w-lg text-center mt-8">
          Your personalized ADHD companion:  
    organize tasks, log moods, manage medications,  
    and power up focus with a built‑in Pomodoro timer—  
    all in one place.
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        {/* Mode Label */}
        <h2 className="text-2xl font-semibold text-center mb-4">
          {mode === "focus" ? "🔍 Focus Time" : "☕ Break Time"}
        </h2>

        {/* Timer Display */}
        <div className="text-5xl font-mono text-center mb-6">
          {mm}:{ss}
        </div>

        {/* Duration Pickers */}
        <div className="flex justify-center gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Focus</label>
            <select
              className="border p-1 rounded w-20 text-center"
              value={focusMinutes}
              onChange={(e) => setFocusMinutes(Number(e.target.value))}
            >
              {focusOptions.map((m) => (
                <option key={m} value={m}>
                  {m}m
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Break</label>
            <select
              className="border p-1 rounded w-20 text-center"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(Number(e.target.value))}
            >
              {breakOptions.map((m) => (
                <option key={m} value={m}>
                  {m}m
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {isRunning ? (
            <button
              onClick={pause}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={start}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            >
              Start
            </button>
          )}
          <button
            onClick={reset}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
