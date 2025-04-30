"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import SkeletonCard from '@/components/SkeletonCard';

interface Inspection {
  id: number;
  inspection_number: string;
  version: number;
  inspection_date: string;
  inspector_name: string;
}

export default function ProjectInspectionsPage() {
  const { id } = useParams();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`http://127.0.0.1:8000/api/projects/${id}/inspections`)
        .then((res) => {
          setInspections(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error('❌ Failed to load inspections.');
          setLoading(false);
        });
    }
  }, [id]);

  console.log('inspections', inspections);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Link
          href={`/projects`}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Inspections</h1>
        <Link
          href={`/projects/${id}/inspections/create`}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          ➕ Add
        </Link>
        
      </div>

      <div className='flex flex-col gap-3'>
        {loading
          ? Array.from({ length: 1 }).map((_, i) => <SkeletonCard key={i} />)
          : inspections.length > 0
            ? inspections.map((inspection) => (
              <div key={inspection.id} className="bg-white shadow-md rounded p-5 border border-gray-200">
                <h2 className="text-xl font-semibold text-blue-800">Inspection #{inspection.inspection_number}</h2>
                <p className="text-sm text-gray-600 mb-2">Version: {inspection.version}</p>
                <p className="text-sm text-gray-600 mb-2">Date: {inspection.inspection_date}</p>
                <p className="text-sm mb-2">Inspector: {inspection.inspector_name}</p>
                <a
                  href={`/projects/${id}/inspections/${inspection.id}`}
                  className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                >
                  View
                </a>
              </div>
            ))
            : <div className="text-center text-gray-600 mt-20">
                <p className="text-xl font-semibold">📭 No inspections yet</p>
                <p className="mt-2">Start by adding your first inspection.</p>
              </div>       
          }
      </div>
          
    </div>
  );
}

