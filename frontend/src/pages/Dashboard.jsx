import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get('/api/tasks', config);
        
        const summary = data.reduce((acc, task) => {
          acc.total += 1;
          if (task.status === 'Pending') acc.pending += 1;
          if (task.status === 'In Progress') acc.inProgress += 1;
          if (task.status === 'Completed') acc.completed += 1;
          return acc;
        }, { total: 0, pending: 0, inProgress: 0, completed: 0 });

        setStats(summary);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Welcome, {user?.name}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Here is your overview for today.</p>
      
      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div className="stat-value">{stats.total}</div>
          <div style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Total Tasks</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-value" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', WebkitBackgroundClip: 'text' }}>{stats.pending}</div>
          <div style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Pending</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-value">{stats.inProgress}</div>
          <div style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>In Progress</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-value" style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', WebkitBackgroundClip: 'text' }}>{stats.completed}</div>
          <div style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Completed</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
