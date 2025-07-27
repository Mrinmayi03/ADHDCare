// src/pages/SentimentCharts.tsx
import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import api from '../api/axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid, ReferenceLine
} from 'recharts';
import Select from 'react-select';

interface SentimentEntry {
  medication: string;
  positive: number;
  negative: number;
}

// If you ever do hit DRF pagination, results will live here:
interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const SentimentCharts: React.FC = () => {
  const [data, setData] = useState<SentimentEntry[]>([]);
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);
  const [fullCSV, setFullCSV] = useState<any[]>([]);

  useEffect(() => {
    api
      .get<SentimentEntry[] | Paginated<SentimentEntry>>('sentiment-summary/')
      .then(res => {
        const payload = res.data;
        // ← GUARANTEE an array, even if payload.results is missing
        const arr: SentimentEntry[] = Array.isArray(payload)
          ? payload
          : Array.isArray((payload as Paginated<SentimentEntry>).results)
            ? (payload as Paginated<SentimentEntry>).results
            : [];                                                        // ← EDITED
        setData(arr);
      })
      .catch(err => console.error(err));

    api
      .get<any[] | Paginated<any>>('sentiment-raw/')
      .then(res => {
        const payload = res.data;
        // ← GUARANTEE an array here too
        const arr: any[] = Array.isArray(payload)
          ? payload
          : Array.isArray((payload as Paginated<any>).results)
            ? (payload as Paginated<any>).results
            : [];                                                        // ← EDITED
        setFullCSV(arr);
      })
      .catch(err => console.warn("Trend data not found yet."));
  }, []);

  const medicationOptions = data.map(d => ({
    value: d.medication,
    label: d.medication,
  }));

  const handleSelection = (selected: any) => {
    setSelectedMeds(selected.map((s: any) => s.value));
  };

  const getTrendData = () => {
    const trendMap: { [med: string]: number[] } = {};
    selectedMeds.forEach(med => (trendMap[med] = []));

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
      const obj: any = { batch: i / 40 + 1 };
      selectedMeds.forEach(med => {
        const slice = trendMap[med].slice(i, i + 40);
        obj[med] = slice.length
          ? slice.reduce((a, b) => a + b, 0) / slice.length
          : null;
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

      <h3 className="text-xl font-semibold mt-8 mb-2">
        Compare Review Trends Between Medications
      </h3>
      <Select
        isMulti
        options={medicationOptions}
        className="mb-4"
        onChange={handleSelection}
        placeholder="Select medications to compare..."
      />

      {selectedMeds.length > 0 && (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={getTrendData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="batch"
              label={{
                value: "Review Batch",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              domain={[-1, 1]}
              label={{
                value: "Avg Sentiment",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" />
            {selectedMeds.map((med, i) => (
              <Line
                key={med}
                type="monotone"
                dataKey={med}
                stroke={`hsl(${(i * 40) % 360}, 70%, 50%)`}
                strokeWidth={1}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SentimentCharts;
