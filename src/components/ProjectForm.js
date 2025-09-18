import React, { useState } from "react";

const ProjectForm = ({ project, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "Planning",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <h2>{project ? "Edit Project" : "Create New Project"}</h2>

      <div className="form-group">
        <label>Project Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter project name"
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the project..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Planning">Planning</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {project ? "Update" : "Create"} Project
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
