'use client';

import { useEffect, useState, useRef  } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

import ModalConfirm from '@/components/ModalConfirm';
import CreateProjectModal from '@/components/CreateProjectModal';
import EditProjectModal from '@/components/EditProjectModal';
import SkeletonCard from '@/components/SkeletonCard';
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { handleApiError } from '@/lib/handleApiError';
import ErrorModal from '@/components/ErrorModal';

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
  project_reference: string;
  inspections: Inspection[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const fetchProjects = () => {
    axios.get('projects')
      .then((res) => {
        setProjects(res.data.data)
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setErrorMessage(handleApiError(err));
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
      toast.error('❌ Failed to delete project.');
    } finally {
      setModalOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleProjectUpdated = (id: number) => {
    fetchProjects(); // оновлюємо список
    setHighlightedId(id); // вмикаємо підсвічування
    setTimeout(() => setHighlightedId(null), 2500); // вимикаємо через 2.5 секунди
  };

  return (
    <ProtectedLayout>
      {errorMessage && (
        <ErrorModal 
          message={errorMessage}
          onClose={() => setErrorMessage(null)} 
        />
      )}

      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center pt-6 px-6">
          <h1 className="text-3xl font-bold text-gray-800 uppercase">Projects</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white font-bold px-4 py-2 rounded
              hover:bg-blue-700 hover:scale-105 active:scale-95 hover:shadow-lg transition duration-100"
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

        {editModalOpen && selectedProject && (
          <EditProjectModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            project={selectedProject}
            onProjectUpdated={(id) => handleProjectUpdated(id)}
          />
        )}

        <div className="flex flex-col gap-4 m-4">
          {loading
            ? Array.from({ length: 1 }).map((_, i) => <SkeletonCard key={i} />)
            : projects.length > 0
              ? projects.map((project) => (
                <div 
                  key={project.id}
                  className={`relative bg-white shadow-md rounded p-5 border border-gray-200 transition-all duration-500 ${
                    highlightedId === project.id ? 'border-green-500 ring-2 ring-green-300' : ''}`}
                >
                    {/* Меню ⋮ */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === project.id ? null : project.id)}
                        className="text-gray-500 hover:text-gray-800 text-xl"
                      >
                        ⋮
                      </button>
                      {menuOpenId === project.id && (
                        <div 
                          ref={menuRef}
                          className="absolute right-0 mt-2 min-w-[110px] bg-white border rounded shadow z-10">
                          <button
                            onClick={() => {
                              setSelectedProject(project);
                              setEditModalOpen(true);
                              setMenuOpenId(null);
                            }}
                            className="block w-full text-center px-4 py-2 hover:bg-gray-100 text-sm my-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              confirmDelete(project.id);
                              setMenuOpenId(null);
                            }}
                            className="block w-full text-center px-4 py-2 hover:bg-gray-100 text-sm text-red-600 my-4"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    <h2 className="text-xl font-semibold text-blue-800 text-center mb-4">{project.project_name}</h2>
                    <div className='flex flex-row justify-between items-center mb-2 gap-2'>
                      <div className="text-sm text-gray-600 flex gap-2 flex-wrap">
                        <p className='font-semibold'>Client:</p> 
                        <p>{project.client}</p>
                      </div>
                      
                      
                    </div>
                    <div className="text-sm text-gray-600 flex gap-2 flex-wrap">
                        <p className='font-semibold'>Reference:</p>
                        <p>{project.project_reference}</p>
                      </div>

                    {project.inspections.length > 0 && (
                      <div className="mt-2 text-sm mt-4">
                        <p className='text-sm text-gray-600 font-semibold'>Latest Inspection:</p>
                        <div className="ml-4">
                          <div className="text-sm text-gray-600 flex gap-2 flex-wrap">
                            <p className='font-semibold'>Date:</p>
                            <p>{new Date(project.inspections[0]?.inspection_date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-sm text-gray-600 flex gap-2 flex-wrap">
                            <p className='font-semibold'>Inspector:</p>
                            <p>{project.inspections[0].inspector_name}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-gray-600 flex gap-2 flex-wrap">
                        <p className='font-semibold'>Status:</p>
                        <p className={project.status === 'in_progress' ? 'text-green-800' : 'text-red-800'}>
                          {project.status.replace('_', ' ')}
                        </p>
                      </div>
                      <Link
                        href={`/projects/${project.id}/inspections`}
                        className="bg-gray-700 text-white text-center py-1 px-4 rounded 
                          hover:bg-gray-800 hover:scale-105 active:scale-95 hover:shadow-lg transition duration-100"
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