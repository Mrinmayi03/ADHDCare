// Tasks.tsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

interface Task {
  id: number;
  title: string;
  is_completed: boolean;
  created_at: string;
  priority: string;
  notes?: string;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [priority, setPriority] = useState('low');
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await api.get('/tasks/');
    setTasks(response.data);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    const payload = {
      title,
      is_completed: isCompleted,
      priority,
      notes,
    };

    if (editId !== null) {
      const response = await api.put(`/tasks/${editId}/`, payload);
      setTasks(tasks.map((task) => (task.id === editId ? response.data : task)));
      setEditId(null);
    } else {
      const response = await api.post('/tasks/', payload);
      setTasks([...tasks, response.data]);
    }

    setTitle('');
    setNotes('');
    setIsCompleted(false);
    setPriority('low');
  };

  const handleEdit = (task: Task) => {
    setTitle(task.title);
    setNotes(task.notes || '');
    setPriority(task.priority);
    setIsCompleted(task.is_completed);
    setEditId(task.id);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/tasks/${id}/`);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>📝 Task Tracker</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
      />

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>

      <label style={{ marginLeft: 10 }}>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
        />
        Completed
      </label>

      <br />
      <button onClick={handleSubmit}>
        {editId !== null ? 'Update' : 'Add'} Task
      </button>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> | Priority: {task.priority} |{' '}
            {task.is_completed ? '✅ Completed' : '⏳ Pending'}
            {task.notes && <div>📝 {task.notes}</div>}
            <button onClick={() => handleEdit(task)} style={{ marginLeft: 10 }}>
              Edit
            </button>
            <button onClick={() => handleDelete(task.id)} style={{ marginLeft: 5 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
