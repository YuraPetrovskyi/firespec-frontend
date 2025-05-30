'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import LoadingButton from '@/components/LoadingButton';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: number;
    project_name: string;
    client: string;
    project_reference: string;
    status: string;
  };
  onProjectUpdated: (id: number) => void;
}

export default function EditProjectModal({
  isOpen,
  onClose,
  project,
  onProjectUpdated,
}: EditProjectModalProps) {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState<'in_progress' | 'completed'>('in_progress');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.project_name);
      setClient(project.client);
      setReference(project.project_reference);
      setStatus(project.status as 'in_progress' | 'completed');
    }
  }, [project]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Project name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(`projects/${project.id}`, {
        project_name: name,
        client,
        project_reference: reference,
        status,
      });
      toast.success('Project updated!');
      onProjectUpdated(project.id);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 animate-zoom-in">
        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Project</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">Client</label>
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">Project Reference</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'in_progress' | 'completed')}
              className="border p-2 rounded"
            >
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-between items-center mt-4 font-semibold">
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <LoadingButton
              isLoading={isSubmitting}
              onClick={handleSave}
              loadingText="Saving..."
            >
              Save
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
}
