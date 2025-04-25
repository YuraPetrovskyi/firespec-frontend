'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

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
  console.log('🚀 ProjectsPage component rendered', projects);
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/projects')
      .then(res => setProjects(res.data.data))
      .catch(err => console.error('❌ Error fetching projects:', err));
  }, []);

  return (
    <div className="p-10 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📁 Projects</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          + Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-blue-700">{project.project_name}</h2>
              <p className="text-sm text-gray-600 mb-1">Client: {project.client}</p>
              <p className="text-sm text-gray-600 mb-2">Status: <span className="font-medium">{project.status}</span></p>

              {project.inspections.length > 0 && (
                <div className="text-sm text-gray-700 mt-3">
                  <p className="font-medium mb-1">🔍 Latest Inspection</p>
                  <ul className="list-disc ml-5">
                    <li>Number: {project.inspections[0].inspection_number}</li>
                    <li>Date: {project.inspections[0].inspection_date}</li>
                    <li>Inspector: {project.inspections[0].inspector_name}</li>
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
