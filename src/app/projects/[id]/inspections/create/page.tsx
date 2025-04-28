"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CreateInspectionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [inspectionDate, setInspectionDate] = useState('');
  const [projectName, setProjectName] = useState('');
  const [client, setClient] = useState('');
  const [digitalRecording, setDigitalRecording] = useState('0');

  const handleCreateInspection = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/projects/${id}/inspections`, {
        inspection_date: inspectionDate,
        project_name: projectName,
        client: client,
        inspector_name: 'test_inspector', // тимчасово заглушка
        digital_recording: digitalRecording,
      });
      toast.success('✅ Inspection created!');
      router.push(`/projects/${id}/inspections`);
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to create inspection.');
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-800">➕ Create New Inspection</h1>

      <div className="bg-white p-6 rounded shadow-md flex flex-col gap-4">

        <input
          type="date"
          placeholder="Inspection Date"
          value={inspectionDate}
          onChange={(e) => setInspectionDate(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Client"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={digitalRecording}
          onChange={(e) => setDigitalRecording(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="0">❌ No Digital Recording</option>
          <option value="1">✅ Digital Recording Available</option>
        </select>

        <button
          onClick={handleCreateInspection}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          ✅ Save Inspection
        </button>
      </div>
    </div>
  );
}
