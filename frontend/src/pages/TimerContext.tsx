// src/context/TimerContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

type Mode = "focus" | "break";

interface TimerContextType {
  focusMinutes: number;
  breakMinutes: number;
  secondsLeft: number;
  mode: Mode;
  isRunning: boolean;
  setFocusMinutes: (m: number) => void;
  setBreakMinutes: (m: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

const TimerContext = createContext<TimerContextType | null>(null);
export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used inside TimerProvider");
  return ctx;
}

export function TimerProvider({ children }: { children: ReactNode }) {
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(focusMinutes * 60);
  const [mode, setMode] = useState<Mode>("focus");
  const [isRunning, setIsRunning] = useState(false);
  const alarmRef = useRef<HTMLAudioElement>(null);

  // reset on duration or mode change
  useEffect(() => {
    setSecondsLeft((mode === "focus" ? focusMinutes : breakMinutes) * 60);
  }, [focusMinutes, breakMinutes, mode]);

  // ticking effect
  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          alarmRef.current?.play();
          const next: Mode = mode === "focus" ? "break" : "focus";
          setMode(next);
          return (next === "focus" ? focusMinutes : breakMinutes) * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, mode, focusMinutes, breakMinutes]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setMode("focus");
    setSecondsLeft(focusMinutes * 60);

    // **stop and rewind the alarm**
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
  };

  return (
    <TimerContext.Provider
      value={{
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
      }}
    >
      {children}
      <audio ref={alarmRef} src="/alarm.mp3" preload="auto" />
    </TimerContext.Provider>
  );
}
