// src/pages/Medications.tsx
import React, { useState, useEffect } from "react";
import API from "../api/axios";

interface Med {
  id: number;
  name: string;
  taken_at: string;      // read‑only
  dose_mg: number;
  brand_name: string;
  prescribed_on: string;
}

// ← EDIT: pagination wrapper for DRF
interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export default function Medications() {
  const [list, setList] = useState<Med[]>([]);
  // ─── Add‑form state
  const [name, setName] = useState("");
  const [dose_mg, setDose] = useState<number>(0);
  const [brand_name, setBrand] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(today);

  // ─── Edit‑mode state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDose, setEditDose] = useState<number>(0);
  const [editBrand, setEditBrand] = useState("");
  const [editDate, setEditDate] = useState<string>(today);

  const fetchMeds = () =>
    // ← EDIT: allow either Med[] or Paginated<Med>
    API.get<Med[] | Paginated<Med>>("medicationlogs/").then((res) => {
      const data = res.data;
      const meds: Med[] = Array.isArray(data)
        ? data
        : // if paginated, pull out .results
          data.results ?? [];
      setList(meds);
    });

  useEffect(() => {
    fetchMeds();
  }, []);

  const handleAdd = () => {
    API.post("medicationlogs/", {
      name,
      dose_mg,
      brand_name,
      prescribed_on: date,
    })
      .then(fetchMeds)
      .catch((err) => {
        console.error("Validation errors:", err.response?.data);
        alert(
          "Failed to save medication:\n" +
            JSON.stringify(err.response?.data, null, 2)
        );
      });
  };

  return (
    <div className="space-y-8">
      {/* ── Add Form ────────────────────────── */}
      <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            className="mt-1 block w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Dose (mg)</label>
          <input
            type="number"
            className="mt-1 block w-full border rounded px-3 py-2"
            value={dose_mg}
            onChange={(e) => setDose(+e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Brand</label>
          <input
            className="mt-1 block w-full border rounded px-3 py-2"
            value={brand_name}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Prescribed On</label>
          <input
            type="date"
            className="mt-1 block w-full border rounded px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="text-right">
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded"
          >
            Add Medication
          </button>
        </div>
      </div>

      {/* ── List & Inline Edit ────────────────────────── */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        {list.map((m) =>
          editingId === m.id ? (
            // ─── EDIT MODE ───────────────────────
            <div
              key={m.id}
              className="bg-yellow-50 rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  className="border rounded px-3 py-2"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  type="number"
                  className="border rounded px-3 py-2"
                  value={editDose}
                  onChange={(e) => setEditDose(+e.target.value)}
                />
                <input
                  className="border rounded px-3 py-2"
                  value={editBrand}
                  onChange={(e) => setEditBrand(e.target.value)}
                />
                <input
                  type="date"
                  className="border rounded px-3 py-2"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <button
                  onClick={() =>
                    API.patch(`medicationlogs/${m.id}/`, {
                      name:           editName,
                      dose_mg:        editDose,
                      brand_name:     editBrand,
                      prescribed_on:  editDate,
                    }).then(() => {
                      setEditingId(null);
                      fetchMeds();
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
            // ─── READ‑ONLY MODE ─────────────────
            <div
              key={m.id}
              className="flex flex-col md:flex-row md:items-center justify-between"
            >
              <div>
                <p className="font-semibold">
                  {m.name} ({m.dose_mg}mg) – {m.brand_name}
                </p>
                <p className="text-xs text-gray-500">
                  Prescribed on {new Date(m.prescribed_on).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 md:mt-0 space-x-2">
                <button
                  onClick={() => {
                    // populate edit state, flip into edit mode
                    setEditingId(m.id);
                    setEditName(m.name);
                    setEditDose(m.dose_mg);
                    setEditBrand(m.brand_name);
                    setEditDate(m.prescribed_on);
                  }}
                  className="px-4 py-1 border rounded hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => API.delete(`medicationlogs/${m.id}/`).then(fetchMeds)}
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
