import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectList from "./components/ProjectList";
import ProjectDetail from "./components/ProjectDetail";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="/project/:projectId" element={<ProjectDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
