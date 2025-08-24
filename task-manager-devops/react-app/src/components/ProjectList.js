import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import ProjectForm from "./ProjectForm";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      await api.createProject(projectData);
      setShowForm(false);
      await loadProjects(); // Reload the list
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await api.deleteProject(projectId);
      await loadProjects();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div className="project-list">
      <div className="page-header">
        <h1>Project Dashboard</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + New Project
        </button>
      </div>

      {showForm && (
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <h3>{project.name}</h3>
              <span
                className={`status-badge status-${project.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {project.status}
              </span>
            </div>

            <p className="project-description">{project.description}</p>

            <div className="project-stats">
              <span>Tasks: {project.tasks?.length || 0}</span>
              <span>
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="project-actions">
              <Link to={`/project/${project.id}`} className="btn-secondary">
                View Details
              </Link>
              <button
                onClick={() => handleDeleteProject(project.id)}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !showForm && (
        <div className="empty-state">
          <h2>No projects yet</h2>
          <p>Create your first project to get started!</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Create First Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
