"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';


interface Inspection {
  inspection_number: string;
  version: number;
  inspection_date: string;
  inspector_name: string;
}

interface Project {
  id: number;
  project_name: string;
  client: string;
  status: string;
  inspections: Inspection[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newClient, setNewClient] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    axios.get('http://127.0.0.1:8000/api/projects')
      .then((res) => setProjects(res.data.data))
      .catch((err) => console.error(err));
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast.error('❌ Project name is required.');
      return;
    }
  
    try {
      await axios.post('http://127.0.0.1:8000/api/projects', {
        project_name: newProjectName,
        client: newClient,
      });
      setNewProjectName('');
      setNewClient('');
      setIsModalOpen(false);
      fetchProjects();
      toast.success('✅ Project created successfully!');
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to create project. Please try again.');
    }
  };

  const handleDeleteProject = (projectId: number) => {
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded p-5 w-[300px] border border-gray-200">
        <p className="text-sm text-gray-800 font-medium mb-4">
          Are you sure you want to delete this project?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteProject(projectId);
            }}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };
  
  const deleteProject = async (projectId: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/projects/${projectId}`);
      toast.success('✅ Project deleted!');
      fetchProjects(); // оновлення списку
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to delete project');
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📁 Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Add Project
        </button>
      </div>

      {/* 🔵 Модалка */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-md w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold mb-6">➕ Create New Project</h2>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Client"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                className="border p-2 rounded"
              />
              <button
                onClick={handleCreateProject}
                className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                ✅ Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔵 Список проектів */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="bg-white shadow-md rounded p-5 border border-gray-200">
          <h2 className="text-xl font-semibold text-blue-800">{project.project_name}</h2>
          <p className="text-sm text-gray-600 mb-2">Client: {project.client}</p>
          <p className="text-sm mb-2">Status: <span className="font-medium">{project.status}</span></p>
        
          {project.inspections.length > 0 && (
            <div className="mt-2 text-sm">
              <p><strong>Latest Inspection:</strong></p>
              <ul className="list-disc ml-4">
                <li>Number: {project.inspections[0].inspection_number}</li>
                <li>Date: {project.inspections[0].inspection_date}</li>
                <li>Inspector: {project.inspections[0].inspector_name}</li>
              </ul>
            </div>
          )}
        
          {/* 🔵 Кнопка перегляду інспекцій */}
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href={`/projects/${project.id}/inspections`}
              className="bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600 transition"
            >
              🔍 View Inspections
            </Link>
            <button
              onClick={() => handleDeleteProject(project.id)}
              className="bg-red-600 text-white py-2 px-4 rounded text-center hover:bg-red-700 transition"
            >
              🗑️ Delete Project
            </button>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}
