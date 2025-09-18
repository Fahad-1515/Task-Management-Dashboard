// Simulated API service with localStorage persistence
const API_DELAY = 200; // ms to simulate network delay

const simulateNetworkDelay = () =>
  new Promise((resolve) => setTimeout(resolve, API_DELAY));

export const api = {
  // READ - Get all projects
  getProjects: async () => {
    await simulateNetworkDelay();
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    return projects;
  },

  // CREATE - Add new project
  createProject: async (projectData) => {
    await simulateNetworkDelay();
    const projects = await api.getProjects();
    const newProject = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...projectData,
      tasks: [],
    };
    projects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(projects));
    return newProject;
  },

  // UPDATE - Update project
  updateProject: async (projectId, updates) => {
    await simulateNetworkDelay();
    const projects = await api.getProjects();
    const index = projects.findIndex((p) => p.id === projectId);
    if (index === -1) throw new Error("Project not found");

    projects[index] = { ...projects[index], ...updates };
    localStorage.setItem("projects", JSON.stringify(projects));
    return projects[index];
  },

  // DELETE - Remove project
  deleteProject: async (projectId) => {
    await simulateNetworkDelay();
    const projects = await api.getProjects();
    const filteredProjects = projects.filter((p) => p.id !== projectId);
    localStorage.setItem("projects", JSON.stringify(filteredProjects));
    return true;
  },

  // TASK OPERATIONS
  addTask: async (projectId, taskData) => {
    await simulateNetworkDelay();
    const projects = await api.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error("Project not found");

    const newTask = {
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
      ...taskData,
    };

    project.tasks.push(newTask);
    localStorage.setItem("projects", JSON.stringify(projects));
    return newTask;
  },

  updateTask: async (projectId, taskId, updates) => {
    await simulateNetworkDelay();
    const projects = await api.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error("Project not found");

    const task = project.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error("Task not found");

    Object.assign(task, updates);
    localStorage.setItem("projects", JSON.stringify(projects));
    return task;
  },

  deleteTask: async (projectId, taskId) => {
    await simulateNetworkDelay();
    const projects = await api.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error("Project not found");

    project.tasks = project.tasks.filter((t) => t.id !== taskId);
    localStorage.setItem("projects", JSON.stringify(projects));
    return true;
  },
};
