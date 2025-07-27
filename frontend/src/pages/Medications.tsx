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

export default function Medications() {
  const [list, setList] = useState<Med[]>([]);
  const [name, setName] = useState("");
  const [dose_mg, setDose] = useState<number>(0);
  const [brand_name, setBrand] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(today);

  const fetchMeds = () =>
    API.get<Med[]>("/api/medicationlogs/")
      .then((res) => setList(res.data))
      .catch((e) => console.error("Failed to fetch meds:", e));

  useEffect(() => {
    fetchMeds();
  }, []);

  const handleAdd = () => {
    API.post("/api/medicationlogs/", {
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

      {/* ── List ───────────────────────────── */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        {list.map((m) => (
          <div
            key={m.id}
            className="flex flex-col md:flex-row md:items-center justify-between"
          >
            <div>
              <p>
                <span className="font-semibold">{m.name}</span> ({m.dose_mg}mg) –{" "}
                {m.brand_name}
              </p>
              <p className="text-xs text-gray-500">
                Prescribed on {new Date(m.prescribed_on).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <button className="px-4 py-1 border rounded hover:bg-gray-50">
                Edit
              </button>
              <button
                onClick={() => API.delete(`/api/medicationlogs/${m.id}/`).then(fetchMeds)}
                className="px-4 py-1 border rounded hover:bg-gray-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

