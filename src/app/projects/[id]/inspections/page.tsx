"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';


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

  useEffect(() => {
    if (id) {
      axios.get(`http://127.0.0.1:8000/api/projects/${id}/inspections`)
        .then((res) => setInspections(res.data.data))
        .catch((err) => {
          console.error(err);
          toast.error('❌ Failed to load inspections.');
        });
    }
  }, [id]);
  console.log(inspections);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📋 Inspections</h1>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {inspections.map((inspection) => (
          <div key={inspection.id} className="bg-white shadow-md rounded p-5 border border-gray-200">
            <h2 className="text-xl font-semibold text-blue-800">Inspection #{inspection.inspection_number}</h2>
            <p className="text-sm text-gray-600 mb-2">Version: {inspection.version}</p>
            <p className="text-sm text-gray-600 mb-2">Date: {inspection.inspection_date}</p>
            <p className="text-sm mb-2">Inspector: {inspection.inspector_name}</p>
            {/* (пізніше додамо кнопку перегляду / редагування інспекції) */}
          </div>
        ))}
      </div>
    </div>
  );
}
