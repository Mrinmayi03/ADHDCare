import { useEffect, useState } from 'react';
import api from '../api/axios';

interface MoodLog {
  id: number;
  mood: string;
  note: string;
  recorded_at: string;
}

export default function MoodLog() {
  const [moods, setMoods] = useState<MoodLog[]>([]);

  useEffect(() => {
    api.get('moodlogs/')
      .then(res => setMoods(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>📈 Mood Logs</h2>
      {moods.map(entry => (
        <div key={entry.id}>
          Mood: {entry.mood} at {new Date(entry.recorded_at).toLocaleString()}<br/>
          Note: {entry.note}
          <hr />
        </div>
      ))}
    </div>
  );
}
