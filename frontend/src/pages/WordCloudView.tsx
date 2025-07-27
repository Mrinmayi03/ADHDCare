// src/pages/WordCloudView.tsx
import React, { useEffect, useState } from "react";
// import axios from "axios";
import api from "../api/axios";                          // ← EDITED
import Select from "react-select";
import D3WordCloud from "../pages/D3WordCloud";

interface WordFreq {
  text: string;
  value: number;
}

// ← EDITED: to handle possible paginated response
interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const WordCloudView: React.FC = () => {
  const [meds, setMeds] = useState<string[]>([]);
  const [selectedMed, setSelectedMed] = useState<string | null>(null);
  const [words, setWords] = useState<WordFreq[]>([]);

  // Fetch medication list for the dropdown
  useEffect(() => {
    api.get<string[] | Paginated<{ medication: string }>>("sentiment-summary/")  // ← EDITED
      .then((res) => {
        const payload = res.data;
        // ← GUARANTEE an array before mapping
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray((payload as Paginated<{ medication: string }>).results)
            ? (payload as Paginated<{ medication: string }>).results
            : [];
        setMeds(list.map((d) => d.medication));                                 // ← EDITED
      })
      .catch(console.error);
  }, []);

  // When the user selects a medication, fetch its wordcounts
  const onSelect = (opt: any) => {
    if (!opt) {
      setSelectedMed(null);
      setWords([]);
      return;
    }
    const med = opt.value;
    setSelectedMed(med);

    api
      .get<WordFreq[] | Paginated<WordFreq>>(`wordcloud/?med=${encodeURIComponent(med)}`)  // ← EDITED
      .then((res) => {
        const payload = res.data;
        // ← GUARANTEE an array before setting
        const arr = Array.isArray(payload)
          ? payload
          : Array.isArray((payload as Paginated<WordFreq>).results)
            ? (payload as Paginated<WordFreq>).results
            : [];
        setWords(arr);                                                                     // ← EDITED
      })
      .catch(console.error);
  };

  // Responsive width: just a simple window-innerWidth
  const [winW, setWinW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 800
  );
  useEffect(() => {
    const onResize = () => setWinW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const cloudWidth = Math.min(Math.max(winW - 64, 300), 900);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Medication Word Cloud</h2>

      <Select
        options={meds.map((m) => ({ value: m, label: m }))}
        onChange={onSelect}
        isClearable
        placeholder="Select a medication…"
        className="mb-6"
      />

      {selectedMed && words.length > 0 ? (
        <D3WordCloud
          words={words}
          width={cloudWidth}
          height={450}
        />
      ) : (
        <p className="text-gray-500">
          {selectedMed
            ? "Loading word cloud…"
            : "Pick a medication to display its word cloud."}
        </p>
      )}
    </div>
  );
};

export default WordCloudView;
