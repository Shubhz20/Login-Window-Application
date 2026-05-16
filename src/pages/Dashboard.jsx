import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskItem from '../components/TaskItem';
import { LogOut, Plus } from 'lucide-react';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, [navigate, token]);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });
      if (res.ok) {
        setTitle('');
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
          <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800">
            <LogOut size={20} className="mr-1" /> Logout
          </button>
        </div>

        <form onSubmit={handleAddTask} className="flex gap-2 mb-8">
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="What needs to be done?" 
            className="flex-1 px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          />
          <button type="submit" className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
            <Plus size={20} className="mr-1" /> Add
          </button>
        </form>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No tasks yet. Create one above!</p>
          ) : (
            tasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggle={() => toggleTaskStatus(task)} 
                onDelete={() => deleteTask(task.id)} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
