import React, { useState, useEffect, useRef } from 'react';

export default function FocusTimer() {
  // user‐selectable durations (in minutes)
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  // timer state:
  const [secondsLeft, setSecondsLeft] = useState(focusMinutes * 60);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [isRunning, setIsRunning] = useState(false);

  // ref to our alarm audio element
  const alarmRef = useRef<HTMLAudioElement>(null);

  // whenever the user changes the durations, if we're stopped reset the clock
  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(mode === 'focus' ? focusMinutes * 60 : breakMinutes * 60);
    }
  }, [focusMinutes, breakMinutes, mode, isRunning]);

  // main ticking effect
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // time's up!
          alarmRef.current?.play();

          // switch mode
          const nextMode = mode === 'focus' ? 'break' : 'focus';
          setMode(nextMode);

          // return the new block's seconds
          return (nextMode === 'focus' ? focusMinutes : breakMinutes) * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, focusMinutes, breakMinutes]);

  // formatting mm:ss
  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');

  return (
    <div className="max-w-sm mx-auto bg-white p-4 rounded shadow space-y-4 text-center">
      <h2 className="text-xl font-bold">Focus Timer</h2>

      {/* Duration selectors */}
      <div className="flex justify-center gap-4">
        <label>
          Focus:
          <select
            className="ml-1 border rounded p-1"
            value={focusMinutes}
            onChange={(e) => setFocusMinutes(Number(e.target.value))}
          >
            {[15, 20, 25, 30, 45, 60].map((m) => (
              <option key={m} value={m}>{m} min</option>
            ))}
          </select>
        </label>

        <label>
          Break:
          <select
            className="ml-1 border rounded p-1"
            value={breakMinutes}
            onChange={(e) => setBreakMinutes(Number(e.target.value))}
          >
            {[5, 10, 15].map((m) => (
              <option key={m} value={m}>{m} min</option>
            ))}
          </select>
        </label>
      </div>

      {/* Timer display */}
      <div className="text-4xl font-mono">
        {minutes}:{seconds}
      </div>
      <div className="uppercase text-sm text-gray-600">
        {mode === 'focus' ? 'Focus time' : 'Break time'}
      </div>

      {/* Controls */}
      <div className="space-x-2">
        <button
          onClick={() => setIsRunning((r) => !r)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setMode('focus');
            setSecondsLeft(focusMinutes * 60);
          }}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-1 rounded"
        >
          Reset
        </button>
      </div>

      {/* hidden audio element */}
      <audio ref={alarmRef} src="/alarm.mp3" preload="auto" />
    </div>
  );
}
