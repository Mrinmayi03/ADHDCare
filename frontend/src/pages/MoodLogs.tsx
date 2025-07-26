import React, { useState, useEffect } from "react";
import axios from "axios";

interface MoodLog {
  id: number;
  mood: string;
  note: string;
  recorded_at: string;
}

const MOOD_OPTIONS: { value: string; label: string }[] = [
  { value: "Happy",     label: "😊 Happy" },
  { value: "Calm",      label: "🧘 Calm / Content" },
  { value: "Neutral",   label: "😐 Neutral" },
  { value: "Irritable", label: "😠 Irritable / Frustrated" },
  { value: "Sad",       label: "😢 Sad / Low" },
  { value: "Anxious",   label: "😰 Anxious / Overwhelmed" },
  { value: "Restless",  label: "🏃 Restless / Jittery" },
  { value: "BurntOut",  label: "💥 Burnt Out" },
  { value: "Stressed",  label: "😫 Stressed / Panicky" },
  { value: "Focused",   label: "🔍 Focused / On Track" },
  { value: "Angry",     label: "😡 Angry" },
];

export default function MoodLogs() {
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [mood, setMood] = useState(MOOD_OPTIONS[0].value);
  const [note, setNote] = useState("");
  const [dateTime, setDateTime] = useState("");

  // edit mode state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMood, setEditMood] = useState(MOOD_OPTIONS[0].value);
  const [editNote, setEditNote] = useState("");
  const [editDateTime, setEditDateTime] = useState("");

  const fetchLogs = () =>
    axios
      .get<MoodLog[]>("/api/moodlogs/")
      .then((res) => setLogs(res.data));

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleAdd = () => {
    axios
      .post("/api/moodlogs/", { mood, note, recorded_at: dateTime })
      .then(fetchLogs)
      .catch((e) => {
        console.error(e.response?.data || e);
        alert("Failed to log mood. See console.");
      });
  };

  return (
    <div className="space-y-8">
      {/* ── Add Form ────────────────────────── */}
      <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Mood */}
        <div>
          <label className="block text-sm font-medium">Mood</label>
          <select
            className="mt-1 block w-full border rounded px-3 py-2"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            {MOOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Note */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Note</label>
          <textarea
            className="mt-1 block w-full border rounded px-3 py-2"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* When */}
        <div>
          <label className="block text-sm font-medium">When</label>
          <input
            type="datetime-local"
            className="mt-1 block w-full border rounded px-3 py-2"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>

        <div className="md:col-span-4 text-right">
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded"
          >
            Log Mood
          </button>
        </div>
      </div>

      {/* ── List & Inline Edit ────────────────────────── */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        {logs.map((log) =>
          editingId === log.id ? (
            <div
              key={log.id}
              className="bg-yellow-50 rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0"
            >
              <div className="flex-1 space-y-2">
                {/* Mood */}
                <select
                  className="block w-full border rounded px-3 py-2"
                  value={editMood}
                  onChange={(e) => setEditMood(e.target.value)}
                >
                  {MOOD_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {/* Note */}
                <textarea
                  className="block w-full border rounded px-3 py-2"
                  rows={2}
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                />
                {/* When */}
                <input
                  type="datetime-local"
                  className="block w-full border rounded px-3 py-2"
                  value={editDateTime}
                  onChange={(e) => setEditDateTime(e.target.value)}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                <button
                  onClick={() =>
                    axios
                      .patch(`/api/moodlogs/${log.id}/`, {
                        mood:         editMood,
                        note:         editNote,
                        recorded_at:  editDateTime,
                      })
                      .then(() => {
                        setEditingId(null);
                        fetchLogs();
                      })
                  }
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="border px-4 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              key={log.id}
              className="flex flex-col md:flex-row md:items-center justify-between"
            >
              <div>
                {/* display emoji+label */}
                <p className="font-semibold">
                  {
                    MOOD_OPTIONS.find((o) => o.value === log.mood)
                      ?.label || log.mood
                  }
                </p>
                <p className="text-sm text-gray-600">{log.note}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(log.recorded_at).toLocaleString()}
                </p>
              </div>
              <div className="mt-4 md:mt-0 space-x-2">
                <button
                  onClick={() => {
                    setEditingId(log.id);
                    setEditMood(log.mood);
                    setEditNote(log.note);
                    setEditDateTime(log.recorded_at.slice(0,16));
                  }}
                  className="px-4 py-1 border rounded hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    axios.delete(`/api/moodlogs/${log.id}/`).then(fetchLogs)
                  }
                  className="px-4 py-1 border rounded hover:bg-gray-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
