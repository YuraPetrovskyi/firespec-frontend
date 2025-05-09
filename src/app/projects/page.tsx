"use client";

import { useEffect, useState } from 'react';
// import axios from 'axios';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ModalConfirm from '@/components/ModalConfirm';
import CreateProjectModal from '@/components/CreateProjectModal';
import SkeletonCard from '@/components/SkeletonCard';
import ProtectedLayout from "@/components/layouts/ProtectedLayout";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    axios.get('projects')
      .then((res) => {
        setProjects(res.data.data)
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error('❌ Failed to load projects.');
        console.error(err)
      });
  };

  const confirmDelete = (id: number) => {
    setProjectToDelete(id);
    setModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await axios.delete(`projects/${projectToDelete}`);
      toast.success('Project deleted!');
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
    <ProtectedLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center pt-6 px-6">
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
            nameAction='Delete'
            title='Delete Project'
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
        <div className="flex flex-col gap-4 m-6">
          {loading
            ? Array.from({ length: 1 }).map((_, i) => <SkeletonCard key={i} />)
            : projects.length > 0
              ? projects.map((project) => (
                <div key={project.id} className="bg-white shadow-md rounded p-5 border border-gray-200">
                  <h2 className="text-xl font-semibold text-blue-800 text-center">{project.project_name}</h2>
                  <div className='flex flex-row justify-between items-center mb-4 gap-2'>
                    <div className="flex flex-row gap-2 text-xs text-gray-600 mb-2">
                      <p className='text-gray-800 font-semibold'>Client:</p> 
                      <p>{project.client}</p>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{project.status}</div>
                  </div>
                  
                
                  {project.inspections.length > 0 && (
                    <div className="mt-2 text-sm">
                      <p><strong>Latest Inspection:</strong></p>
                      <ul className="list-disc ml-4">
                        <li>Date: {new Date(project.inspections[0].inspection_date).toLocaleDateString()}</li>
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
              ))
            : <div className="text-center text-gray-600 mt-20">
                <p className="text-xl font-semibold">No projects yet</p>
                <p className="mt-2">Start by adding your first project</p>
              </div>       
          }
        </div>
      </div>
    </ProtectedLayout>
  );
}
