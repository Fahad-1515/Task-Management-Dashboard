import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import TaskForm from "./TaskForm";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjects();
      const foundProject = projects.find((p) => p.id === projectId);
      if (!foundProject) {
        navigate("/");
        return;
      }
      setProject(foundProject);
    } catch (error) {
      console.error("Failed to load project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      await api.addTask(projectId, taskData);
      setShowTaskForm(false);
      await loadProject();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await api.updateTask(projectId, taskId, updates);
      setEditingTask(null);
      await loadProject();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.deleteTask(projectId, taskId);
      await loadProject();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const toggleTaskCompletion = async (taskId, completed) => {
    await handleUpdateTask(taskId, { completed: !completed });
  };

  if (loading) return <div className="loading">Loading project...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="project-detail">
      <button onClick={() => navigate("/")} className="back-button">
        ← Back to Projects
      </button>

      <div className="project-header">
        <h1>{project.name}</h1>
        <span
          className={`status-badge status-${project.status
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {project.status}
        </span>
      </div>

      <p className="project-description">{project.description}</p>

      <div className="section">
        <div className="section-header">
          <h2>Tasks ({project.tasks?.length || 0})</h2>
          <button onClick={() => setShowTaskForm(true)} className="btn-primary">
            + Add Task
          </button>
        </div>

        {showTaskForm && (
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setShowTaskForm(false)}
          />
        )}

        <div className="tasks-list">
          {project.tasks?.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              <div className="task-main">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id, task.completed)}
                  className="task-checkbox"
                />
                <div className="task-content">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span
                      className={`priority-badge priority-${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="due-date">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="task-actions">
                <button
                  onClick={() => setEditingTask(task)}
                  className="btn-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {(!project.tasks || project.tasks.length === 0) && !showTaskForm && (
          <div className="empty-state">
            <p>No tasks yet. Add your first task to get started!</p>
          </div>
        )}
      </div>

      {editingTask && (
        <div className="modal-overlay">
          <div className="modal">
            <TaskForm
              task={editingTask}
              onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
