"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📋 Inspections</h1>
        <Link
          href={`/projects/${id}/inspections/create`}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          ➕ Add Inspection
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {inspections.map((inspection) => (
          <div key={inspection.id} className="bg-white shadow-md rounded p-5 border border-gray-200">
            <h2 className="text-xl font-semibold text-blue-800">Inspection #{inspection.inspection_number}</h2>
            <p className="text-sm text-gray-600 mb-2">Version: {inspection.version}</p>
            <p className="text-sm text-gray-600 mb-2">Date: {inspection.inspection_date}</p>
            <p className="text-sm mb-2">Inspector: {inspection.inspector_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
