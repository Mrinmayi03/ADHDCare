// src/pages/Tasks.tsx
import React, { useState, useEffect } from "react";
import API from "../api/axios";

interface Task {
  id: number;
  title: string;
  notes: string;
  priority: "low" | "medium" | "urgent";
  is_completed: boolean;
}

// pagination wrapper (you already added this)
interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // form state (for "Add")
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "urgent">("low");
  const [completed, setCompleted] = useState<boolean>(false);

  // edit‑mode state (per‑field)
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editPriority, setEditPriority] =
    useState<"low" | "medium" | "urgent">("low");
  const [editIsCompleted, setEditIsCompleted] = useState<boolean>(false);

  const fetchTasks = () =>
    API.get<Task[] | Paginated<Task>>("tasks/").then((res) => {
      const list: Task[] = Array.isArray(res.data)
        ? res.data
        : res.data.results ?? [];
      setTasks(list);
    });

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = () => {
    API.post("tasks/", {
      title,
      notes,
      priority,
      is_completed: completed,
    }).then(() => {
      setTitle("");
      setNotes("");
      setPriority("low");
      setCompleted(false);
      fetchTasks();
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center space-x-2">
        <span>📝</span>
        <span>Task Tracker</span>
      </h1>

      {/* ─── Add Form ────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* ... your existing add-form inputs untouched ... */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="mt-1 block w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Notes</label>
          <textarea
            className="mt-1 block w-full border rounded px-3 py-2"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Priority</label>
          <select
            className="mt-1 block w-full border rounded px-3 py-2"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "urgent")
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="urgent">Urgent</option>
          </select>
          <label className="mt-2 flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            <span>Completed</span>
          </label>
        </div>
        <div className="md:col-span-4 text-right">
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* ─── Task List & Inline Edit ───────────────────────── */}
      <div className="space-y-4">
        {tasks.map((t) => (
          editingId === t.id ? (
            <div
              key={t.id}
              className="bg-yellow-50 rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0"
            >
              {/* … your existing inline‐edit JSX … */}
              <div className="flex-1 space-y-2">
                <input
                  className="w-full border rounded px-3 py-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="w-full border rounded px-3 py-2"
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
                <select
                  className="w-full border rounded px-3 py-2"
                  value={editPriority}
                  onChange={(e) =>
                    setEditPriority(
                      e.target.value as "low" | "medium" | "urgent"
                    )
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="urgent">Urgent</option>
                </select>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editIsCompleted}
                    onChange={(e) => setEditIsCompleted(e.target.checked)}
                  />
                  <span>Completed</span>
                </label>
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                <button
                  onClick={() =>
                    API.patch(`tasks/${t.id}/`, {
                      title:editTitle,
                      notes: editNotes,
                      priority: editPriority,
                      is_completed: editIsCompleted,
                    }).then(() => {
                      setEditingId(null);
                      fetchTasks();
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
              key={t.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center justify-between"
            >
              {/* … your existing display JSX … */}
              <div>
                <p className="font-semibold">{t.title}</p>
                <p className="text-sm text-gray-600">{t.notes}</p>
                <p className="mt-1 text-xs">
                  Priority:{" "}
                  <span className="capitalize">{t.priority}</span> |{" "}
                  {t.is_completed ? (
                    <span className="text-green-600">✅ Completed</span>
                  ) : (
                    <span className="text-yellow-600">⏳ Pending</span>
                  )}
                </p>
              </div>
              <div className="mt-4 md:mt-0 space-x-2">
                <button
                  onClick={() => {
                    setEditingId(t.id);
                    setEditTitle(t.title);
                    setEditNotes(t.notes);
                    setEditPriority(t.priority);
                    setEditIsCompleted(t.is_completed);
                  }}
                  className="px-4 py-1 border rounded hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => API.delete(`tasks/${t.id}/`).then(fetchTasks)}
                  className="px-4 py-1 border rounded hover:bg-gray-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}



