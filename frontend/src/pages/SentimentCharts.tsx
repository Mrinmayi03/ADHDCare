// src/pages/SentimentCharts.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';
import Select from 'react-select';

interface SentimentEntry {
  medication: string;
  positive: number;
  negative: number;
}

const SentimentCharts: React.FC = () => {
  const [data, setData] = useState<SentimentEntry[]>([]);
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);
  const [fullCSV, setFullCSV] = useState<any[]>([]); // for trend chart

  useEffect(() => {
    // fetch bar chart summary
    axios.get('/api/sentiment-summary/')
      .then(res => setData(res.data))
      .catch(err => console.error(err));

    // fetch full CSV for trend analysis
    axios.get('/api/sentiment-raw/')
  .then(res => setFullCSV(res.data))
  .catch(err => console.warn("Trend data not found yet."));
  }, []);

  const medicationOptions = data.map(d => ({ value: d.medication, label: d.medication }));

  const handleSelection = (selected: any) => {
    setSelectedMeds(selected.map((s: any) => s.value));
  };

  // For LineChart: simulate trends by comment batch
  const getTrendData = () => {
    const trendMap: { [med: string]: number[] } = {};
    selectedMeds.forEach(med => trendMap[med] = []);

    fullCSV.forEach((row: any) => {
      const { medication, sentiment } = row;
      if (selectedMeds.includes(medication)) {
        const score = sentiment === "POSITIVE" ? 1 : -1;
        trendMap[medication].push(score);
      }
    });

    const length = Math.max(...Object.values(trendMap).map(arr => arr.length));
    const result: any[] = [];
    for (let i = 0; i < length; i += 20) {
      const obj: any = { batch: i / 20 + 1 };
      selectedMeds.forEach(med => {
        const slice = trendMap[med].slice(i, i + 20);
        obj[med] = slice.length ? slice.reduce((a, b) => a + b, 0) / slice.length : null;
      });
      result.push(obj);
    }
    return result;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Medication Sentiment Overview</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="medication" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="positive" fill="#34d399" />
          <Bar dataKey="negative" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>

      <h3 className="text-xl font-semibold mt-8 mb-2">Compare Review Trends Between Medications</h3>
      <Select
        isMulti
        options={medicationOptions}
        className="mb-4"
        onChange={handleSelection}
        placeholder="Select medications to compare..."
      />

      {selectedMeds.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getTrendData()}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="batch" />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedMeds.map((med, i) => (
              <Line key={med} type="monotone" dataKey={med} stroke={`hsl(${(i * 40) % 360}, 70%, 50%)`} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SentimentCharts;
