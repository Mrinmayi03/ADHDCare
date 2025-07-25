import React, { useEffect, useState } from 'react';
import api from '../api/axios';

interface MoodLog {
  id: number;
  mood: string;
  note: string;
  recorded_at: string;
}

const MOOD_SCORES: Record<string, number> = {
  Happy: 2,
  Focused: 2,
  Calm: 1,
  Neutral: 0,
  Irritable: -1,
  Anxious: -1,
  Restless: -1,
  Sad: -2,
  BurntOut: -2,
  Stressed: -2,
};

const MOOD_OPTIONS = [
  { value: 'Happy', label: '😄 Happy' },
  { value: 'Calm', label: '🙂 Calm / Content' },
  { value: 'Neutral', label: '😐 Meh' },
  { value: 'Irritable', label: '😠 Irritable / Frustrated' },
  { value: 'Sad', label: '😢 Sad / Low' },
  { value: 'Anxious', label: '😰 Anxious / Overwhelmed' },
  { value: 'Restless', label: '😤 Restless / Jittery' },
  { value: 'BurntOut', label: '😩 Burnt Out' },
  { value: 'Stressed', label: '🤯 Stressed' },
  { value: 'Focused', label: '🧠 Focused / On Track' },
  { value: 'Angry' , label: '😡 Angry'},
];

const MoodLog: React.FC = () => {
  const [mood, setMood] = useState('Happy');
  const [note, setNote] = useState('');
  const [recordedAt, setRecordedAt] = useState('');
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;


  useEffect(() => {
    fetchMoodLogs();
  }, []);

  const fetchMoodLogs = async () => {
    const response = await api.get('/moodlogs/');
    setLogs(response.data);
  };

  const handleSubmit = async () => {
    const payload = {
      mood,
      note,
      recorded_at: recordedAt || null,
    };

    if (editId !== null) {
      const response = await api.put(`/moodlogs/${editId}/`, payload);
      setLogs(logs.map((log) => (log.id === editId ? response.data : log)));
      setEditId(null);
    } else {
      const response = await api.post('/moodlogs/', payload);
      setLogs([...logs, response.data]);
    }

    setMood('Happy');
    setNote('');
    setRecordedAt('');
  };

  const handleEdit = (log: MoodLog) => {
    setMood(log.mood);
    setNote(log.note);
    setRecordedAt(log.recorded_at.slice(0, 16));
    setEditId(log.id);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/moodlogs/${id}/`);
    setLogs(logs.filter((log) => log.id !== id));
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>🧠 Mood Logs</h2>

      <select value={mood} onChange={(e) => setMood(e.target.value)}>
        {MOOD_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
      <input type="datetime-local" value={recordedAt} onChange={(e) => setRecordedAt(e.target.value)} />
      <button onClick={handleSubmit}>{editId !== null ? 'Update' : 'Log'} Mood</button>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {logs.map((log) => (
          <li key={log.id}>
            <strong>{log.mood}</strong>: {log.note} (
              {log.recorded_at ? new Date(log.recorded_at).toLocaleString() : 'N/A'})
            <button onClick={() => handleEdit(log)}>Edit</button>
            <button onClick={() => handleDelete(log.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoodLog;
