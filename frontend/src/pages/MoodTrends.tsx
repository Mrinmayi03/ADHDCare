// src/pages/MoodTrends.tsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MOOD_SCORES: Record<string, number> = {
  BurntOut: 1,
  Sad: 2,
  Irritable: 3,
  Angry: 3.5,
  Restless: 4,
  Neutral: 5,
  Anxious: 6,
  Stressed: 6,
  Calm: 7,
  Focused: 8,
  Happy: 10,
};

interface MoodLog {
  mood: string;
  recorded_at: string;
}

// ← EDIT: pagination wrapper for DRF
interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const MoodTrends: React.FC = () => {
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [range, setRange] = useState<'week' | 'month'>('week');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const response = await api.get<MoodLog[] | Paginated<MoodLog>>('/moodlogs/');
    const data = response.data;
    const arr = Array.isArray(data) 
      ? data 
      : // ← EDIT: unwrap .results if paginated
        data.results ?? [];
    setLogs(arr);
  };

  const formatDateLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // returns YYYY-MM-DD in local time
  };

  // Group mood logs and average them
  const getAveragedData = () => {
    const grouped: Record<string, number[]> = {};

    logs.forEach(log => {
      const date = new Date(log.recorded_at);
      let key = '';

      if (range === 'week') {
        key = formatDateLocal(date); // YYYY-MM-DD
      } else if (range === 'month') {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        key = `${year}-${month}`; // YYYY-MM
      }

      const score = MOOD_SCORES[log.mood] ?? 0;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(score);
    });

    const labels = Object.keys(grouped).sort();
    const scores = labels.map(label => {
      const values = grouped[label];
      const avg = values.reduce((sum, s) => sum + s, 0) / values.length;
      return parseFloat(avg.toFixed(2));
    });

    return { labels, scores };
  };

  const { labels, scores } = getAveragedData();

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>📈 Mood Trends</h2>

      <select value={range} onChange={(e) => setRange(e.target.value as 'week' | 'month')}>
        <option value="week">Past Week</option>
        <option value="month">Past Month</option>
      </select>

      <Line
        data={{
          labels,
          datasets: [
            {
              label: 'Average Mood Score (1–10)',
              data: scores,
              fill: false,
              borderColor: '#fba5d1ff',
              backgroundColor: '#55223cff',
              tension: 0.3,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true },
            title: {
              display: true,
              text: `Mood Trend (${range})`,
            },
          },
          scales: {
            y: {
              min: 0,
              max: 10,
              title: {
                display: true,
                text: 'Mood Intensity (1–10)',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default MoodTrends;

