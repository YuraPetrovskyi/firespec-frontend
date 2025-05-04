'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
  const [newProjectName, setNewProjectName] = useState('');
  const [newClient, setNewClient] = useState('');

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
      toast.success('✅ Project created successfully!');
      onProjectCreated(); // оновити список
      onClose(); // закрити модалку
      setNewProjectName('');
      setNewClient('');
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to create project. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded shadow-md w-96 relative">
        
        <h2 className="text-2xl font-semibold mb-6 text-center"> Create New Project</h2>

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
          <div className='flex justify-between items-center mt-4 font-semibold'>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateProject}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Save Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
