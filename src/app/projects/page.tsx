"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ModalConfirm from '@/components/ModalConfirm';
import CreateProjectModal from '@/components/CreateProjectModal';

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

  const [modalOpen, setModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);


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

  const confirmDelete = (id: number) => {
    setProjectToDelete(id);
    setModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/projects/${projectToDelete}`);
      toast.success('✅ Project deleted!');
      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to delete project.');
    } finally {
      setModalOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 uppercase">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white font-bold px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Project
        </button>
      </div>

      {modalOpen && (
        <ModalConfirm
          message="Are you sure you want to delete this project?"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setModalOpen(false);
            setProjectToDelete(null);
          }}
        />
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={fetchProjects}
      />

      {/* 🔵 Список проектів */}
      <div className="flex flex-col gap-4">

        {projects.map((project) => (
          <div key={project.id} className="bg-white shadow-md rounded p-5 border border-gray-200">
            <h2 className="text-xl font-semibold text-blue-800 text-center">{project.project_name}</h2>
            <div className='flex flex-row justify-between items-center mb-4 gap-2'>
              <span className="text-xs text-gray-600 mb-2">Client: {project.client}</span>
              <span className="text-xs text-gray-600 mb-2">{project.status}</span>
            </div>
            
          
            {project.inspections.length > 0 && (
              <div className="mt-2 text-sm">
                <p><strong>Latest Inspection:</strong></p>
                <ul className="list-disc ml-4">
                  <li>Date: {new Date(project.inspections[0].inspection_date).toLocaleDateString("en-GB")}</li>
                  <li>Inspector: {project.inspections[0].inspector_name}</li>
                </ul>
              </div>
            )}
          
            <div className="mt-4 flex flex-row justify-between gap-2">
              <button
                onClick={() => confirmDelete(project.id)}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
              <Link
                href={`/projects/${project.id}/inspections`}
                className="bg-gray-700 text-white py-2 px-6 rounded hover:bg-gray-800 transition"
              >
                All Inspections
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
