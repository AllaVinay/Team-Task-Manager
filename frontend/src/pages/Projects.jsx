import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('/api/projects', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects', error);
    }
  };

  const handleCreateProject = async () => {
    try {
      const res = await axios.post(
        "/api/projects",
        newProject,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setProjects([...projects, res.data]);
      setShowModal(false);
      setNewProject({ name: "", description: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Projects</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Project
        </button>
      </div>

      {showModal && (
        <div className="center-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, justifyContent: 'center' }}>
          <div className="card">
            <h3>Create Project</h3>

            <input
              className="input-field"
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
            />

            <input
              className="input-field"
              placeholder="Description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
            />

            <button className="btn-primary" onClick={handleCreateProject}>Create</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {projects.map((project) => (
          <div key={project._id} className="glass-panel card">
            <h3>{project.name}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '3rem' }}>{project.description || 'No description'}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>By: {project.createdBy?.name || 'Unknown'}</span>
              <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-color)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                {project.members?.length} Members
              </span>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
