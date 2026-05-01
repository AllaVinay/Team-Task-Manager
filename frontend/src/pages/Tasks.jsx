import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '', assignedTo: '', dueDate: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
    if (user.role === 'Admin') {
      fetchProjectsAndUsers();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('/api/tasks', { headers: { Authorization: `Bearer ${user.token}` } });
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const fetchProjectsAndUsers = async () => {
    try {
      const [projRes, usersRes] = await Promise.all([
        axios.get('/api/projects', { headers: { Authorization: `Bearer ${user.token}` } }),
        axios.get('/api/auth/users', { headers: { Authorization: `Bearer ${user.token}` } })
      ]);
      setProjects(projRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching related data', error);
    }
  };

  const handleCreateTask = async () => {
    try {
      const payload = { ...newTask };
      if (!payload.assignedTo) delete payload.assignedTo;
      if (!payload.dueDate) delete payload.dueDate;

      await axios.post("/api/tasks", payload, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert("Task Created!");
      setShowModal(false);
      setNewTask({ title: '', description: '', projectId: '', assignedTo: '', dueDate: '' });
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error creating task');
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus }, { headers: { Authorization: `Bearer ${user.token}` } });
      fetchTasks();
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-progress';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Tasks</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Task
        </button>
      </div>

      {showModal && (
        <div className="center-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, justifyContent: 'center' }}>
          <div className="card">
            <h3>Create Task</h3>

            <input
              className="input-field"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />

            <input
              className="input-field"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />

            <select
              className="input-field"
              value={newTask.projectId}
              onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              className="input-field"
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
            >
              <option value="">Assign To (Optional)</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="input-field"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />

            <button className="btn-primary" onClick={handleCreateTask}>Create</button>
          </div>
        </div>
      )}

      <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--border-radius)' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Project</th>
              <th>Assigned To</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td style={{ fontWeight: 500 }}>{task.title}</td>
                <td>{task.projectId?.name || 'N/A'}</td>
                <td>{task.assignedTo?.name || 'Unassigned'}</td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(task.status)}`}>{task.status}</span>
                </td>
                <td>
                  <select 
                    className="form-control" 
                    style={{ padding: '0.25rem', width: '120px', background: 'var(--bg-color)' }}
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No tasks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
