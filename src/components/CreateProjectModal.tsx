'use client';

import { useState, useEffect } from "react";
import LoadingButton from '@/components/LoadingButton';
import ClientSelect from '@/components/ClientSelect';

// import axios from 'axios';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
  const [newProjectName, setNewProjectName] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newReference, setNewReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);  

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsVisible(false);
      onClose(); // Закриваємо після анімації
    }, 300); // має збігатися з duration у tailwind.config.js
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast.error('❌ Project name is required.');
      return;
    }
    setIsSubmitting(true);

    try {
      await axios.post('projects', {
        project_name: newProjectName,
        client: newClient,
        project_reference: newReference,
      });
      toast.success('Project created successfully!');
      onProjectCreated(); // оновити список
      handleClose();; // закрити модалку
      setNewProjectName('');
      setNewClient('');
      setNewReference('');
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false); // 🔚 Розблокувати кнопку
    }
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className={`bg-white p-6 rounded shadow-md w-96 transition-all duration-300
          ${isClosing ? 'animate-zoom-out' : 'animate-zoom-in'}`}
      >
        
        <h2 className="text-2xl font-semibold mb-6 text-center"> Create New Project</h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Project Name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="border p-2 rounded text-gray-600"
          />
          <ClientSelect
            selectedClient={newClient}
            onChange={setNewClient}
          />
          <input
            type="text"
            placeholder="Project Reference"
            value={newReference}
            onChange={(e) => setNewReference(e.target.value)}
            className="border p-2 rounded text-gray-600"
          />
          <div className='flex justify-between items-center mt-4 font-semibold'>
            <button
              onClick={handleClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded
                hover:scale-105 active:scale-95 hover:shadow-lg transition duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <LoadingButton
              isLoading={isSubmitting}
              onClick={handleCreateProject}
              loadingText='Saving...'
            >
              Save Project
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
}
