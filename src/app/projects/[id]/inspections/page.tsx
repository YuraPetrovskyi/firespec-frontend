"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
// import axios from 'axios';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

import SkeletonCard from '@/components/SkeletonCard';
import ModalConfirm from '@/components/ModalConfirm';
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { loadInspectionFromLocal } from '@/lib/inspectionLocalStorage';
import { loadEditInspectionFromLocal } from '@/lib/inspectionLocalStorage';

interface Inspection {
  id: number;
  inspection_number: string;
  version: number;
  inspection_date: string;
  inspector_name: string;
  details: {
    project_name: string;
  };
}

export default function ProjectInspectionsPage() {
  const { id } = useParams();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInspectionId, setSelectedInspectionId] = useState<number | null>(null);

  const [hasDraft, setHasDraft] = useState(false);
  
  const handleDeleteInspection = async () => {
    if (!selectedInspectionId) return;
  
    try {
      await axios.delete(`projects/${id}/inspections/${selectedInspectionId}`);
      toast.success('Inspection deleted!');
      setInspections(prev => prev.filter(i => i.id !== selectedInspectionId));
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to delete inspection.');
    } finally {
      setModalOpen(false);
      setSelectedInspectionId(null);
    }
  };
  
  useEffect(() => {
    if (!id) return;

    // Загрузка списку інспекцій
    setLoading(true);
    axios.get(`projects/${id}/inspections`)
      .then((res) => setInspections(res.data.data))
      .catch((err) => {
        console.error(err);
        toast.error('❌ Failed to load inspections.');
      })
      .finally(() => setLoading(false));

    // Перевірка чернетки нової інспекції
    const saved = loadInspectionFromLocal(id as string);
    const isValidDraft = saved && Object.keys(saved.projectInformation || {}).length > 1;
    setHasDraft(isValidDraft);
  }, [id]);

  // console.log('inspections', inspections);

  return (
    <ProtectedLayout>
      
      <div className="p-4 pb-10 bg-gray-100 min-h-screen">
        {hasDraft && (
              <div className="text-yellow-800 bg-yellow-100 border border-yellow-400 px-4 py-2 rounded mb-2">
                ⚠️ You have unsaved progress from your last visit.
              </div>
            )}
        <Link
          href={`/projects`}
          className="bg-gray-700 text-white py-2 px-6 rounded hover:bg-gray-800 fixed bottom-3 left-3"
        >
          Back
        </Link>
        <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 uppercase">Inspections</h1>
          <Link
            href={`/projects/${id}/inspections/create`}
            className="bg-blue-600 text-white font-bold px-4 py-2 rounded
            hover:bg-blue-700 hover:scale-105 active:scale-95 hover:shadow-lg transition duration-100"
          >
            {hasDraft ? 'Continue Inspection' : 'Create Inspection'}
          </Link>
        </div>
        
  
        <div className='flex flex-col gap-3 mb-6'>
          {loading
            ? Array.from({ length: 1 }).map((_, i) => <SkeletonCard key={i} />)
            : inspections.length > 0
              ? inspections.map((inspection) => {
                const localEdit = loadEditInspectionFromLocal(id as string, inspection.id.toString());
                const hasUnsaved = localEdit && Object.keys(localEdit.projectInformation || {}).length > 1;
                
                return (
                  <div key={inspection.id} className="bg-white shadow-md rounded p-3 border border-gray-200">
                    <div className='flex flex-row flex-wrap justify-between items-center gap-2 mb-2'>
                      <h2 className="text-xl font-semibold text-blue-800">Inspection {inspection.inspection_number}</h2>
                      <p className="text-xl font-bold">Version {inspection.version}</p>
                    </div>                    

                    {inspection.version > 1 && (
                      <div className='flex justify-between items-center mb-2'>
                        <p className="text-sm text-green-500 mb-2">edited version ...</p>
                        <Link
                          href={`/projects/${id}/inspections/${inspection.id}/logs`}
                          className="bg-green-500/60 text-white py-1 px-2 rounded
                          hover:bg-green-700 hover:scale-105 active:scale-95 hover:shadow-lg transition duration-100"
                        >
                          View Change Log
                        </Link>
                      </div>
                      
                    )}

                    <div className="ml-2">
                      <p className="text-sm text-gray-600 mb-2">Project name: {inspection.details?.project_name}</p>
                      <p className="text-sm text-gray-600 mb-2">Inspection Date: {new Date(inspection.inspection_date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600 mb-2">Inspector: {inspection.inspector_name}</p>
                    </div>
                    {hasUnsaved && (
                      <div className="text-yellow-800 bg-yellow-100 border border-yellow-400 px-3 py-1 rounded mb-2 text-sm text-center">
                        ⚠️ You have unsaved edits for this inspection.
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => {
                          setSelectedInspectionId(inspection.id);
                          setModalOpen(true);
                        }}
                        className="bg-red-600 text-white py-1 px-3 rounded
                          hover:bg-red-700 hover:bg-blue-700 hover:scale-105 active:scale-95 hover:shadow-lg transition duration-100"
                      >
                        Delete
                      </button>
                      <Link
                        href={`/projects/${id}/inspections/${inspection.id}`}
                        className="bg-gray-700 text-white py-1 px-3 rounded 
                          hover:bg-gray-800 hover:bg-blue-700 hover:scale-105 active:scale-95 hover:shadow-lg transition duration-100"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                );
              })
              : <div className="text-center text-gray-600 mt-20">
                  <p className="text-xl font-semibold">📭 No inspections yet</p>
                  <p className="mt-2">Start by adding your first inspection.</p>
                </div>       
          }
        </div>
  
        {modalOpen && (
          <ModalConfirm
            message="Are you sure you want to delete this inspection?"
            nameAction='Delete'
            title='Delete Inspection'
            onConfirm={handleDeleteInspection}
            onCancel={() => {
              setModalOpen(false);
              setSelectedInspectionId(null);
            }}
          />
        )}
            
      </div>
    </ProtectedLayout>
  );
}

