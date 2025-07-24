import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Task {
  id: number;
  title: string;
  due_date: string;
  is_completed: boolean;
  notes: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
  api.get('tasks/')
    .then(res => {
      console.log("✅ API Response:", res.data);
      setTasks(res.data);
    })
    .catch(err => {
      console.error("❌ API Error:", err);
    });
}, []);


  return (
    <div>
      <h2>📝 ADHD Task Tracker</h2>
      {tasks.map(task => (
        <div key={task.id}>
          <strong>{task.title}</strong> — Due: {new Date(task.due_date).toLocaleDateString()}<br/>
          Status: {task.is_completed ? '✅ Completed' : '⏳ Pending'}<br/>
          Notes: {task.notes || 'N/A'}
          <hr />
        </div>
      ))}
    </div>
  );
}
