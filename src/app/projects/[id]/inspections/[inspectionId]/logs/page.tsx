'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import axios from 'axios';
import toast from 'react-hot-toast';

type Log = {
  id: number;
  changed_by: string;
  changed_at: string;
  new_value: string;
};

type Change = {
  category: string;
  subcategory?: string;
  field: string;
  from?: any;
  to: any;
};
const preIns = 'Pre-Inspection';
const projInf = 'Project Information';
const siteIns = 'Site Inspections';
const postIns = 'Post-Inspection';

const CATEGORIES = [
  projInf,
  preIns,
  siteIns,
  postIns,
];

export default function LogsPage() {
  const { id, inspectionId } = useParams();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (id && inspectionId) {
      axios
        .get(`http://127.0.0.1:8000/api/projects/${id}/inspections/${inspectionId}/logs`)
        .then((res) => {
          setLogs(res.data.data);
          console.log('logs', res.data.data); 
        })
        .catch(() => toast.error('❌ Failed to load logs'))
        .finally(() => setLoading(false));
    }
  }, [id, inspectionId]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (logs.length === 0) {
    return <p className="text-center text-gray-500">No change logs found for this inspection.</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 font-mono">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">change logs</h1>

      {logs.map((log) => {
        const parsedChanges: Change[] = JSON.parse(log.new_value || '[]');
        console.log('parsedChanges', parsedChanges); // Дебаг
        // Групування змін по категоріях
        const grouped = CATEGORIES.reduce((acc: Record<string, Change[]>, category) => {
          acc[category] = parsedChanges.filter((c) => c.category === category);
          return acc;
        }, {});
        console.log('grouped', grouped); // Дебаг

        return (
          <div key={log.id} className="bg-white shadow rounded-md p-5 border">
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>👤  <strong>{log.changed_by}</strong></span>
              <span>🕒 {new Date(log.changed_at).toLocaleString()}</span>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-2">{preIns}</h2>
              {grouped[preIns].length > 0 ? (
                  <ul className="space-y-1 mb-2 bg-sky-500/5 p-2 rounded-md">
                    {grouped[preIns].map((c, i) => (
                      <li key={i} className="text-sm flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <div className='flex flex-row sm:flex-row sm:gap-2 ml-4'>
                          <div className="font-medium text-gray-500">{c.field}: </div>
                          <div className='flex flex-wrap ml-2'>
                            <span className='text-red-600'>{c.from == 0 ? 'no' : 'yes'}</span>
                            <span className='mx-2'>→</span>
                            <span className='text-green-600'>{c.from == 0 ? 'no' : 'yes'}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm mb-2 ml-2">No changes in this section.</p>
                )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-2">{projInf}</h2>
              {grouped[projInf].length > 0 ? (
                  <ul className="space-y-1 mb-2 bg-sky-500/5 p-2 rounded-md">
                    {grouped[projInf].map((c, i) => (
                      <li key={i} className="text-sm flex flex-col gap-2 ml-2">
                        {
                          String(c.field).includes("digital_recording") 
                            ? 
                            <div>
                              <span className="font-medium text-gray-500">{c.field}:</span>
                              <div className='flex flex-wrap ml-2'>
                                <span className="text-red-600 ">{c.from == 0 ? 'no' : 'yes'}</span>
                                <span className='mx-2'>→</span>
                                <span className="text-green-600">{c.to == 0 ? 'no' : 'yes'}</span>
                              </div>
                            </div> 
                            :                        
                          <div>
                            <span className="font-medium text-gray-500">{c.field}:</span>
                            <div className='flex flex-wrap ml-2'>
                              <span className="text-red-600 ">{c.from ?? '---'} </span>
                              <span className='mx-2'>→</span>
                              <span className="text-green-600">{c.to ?? '---'}</span>
                            </div>
                          </div>
                        }
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm mb-2 ml-2">No changes in this section.</p>
                )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-2">Site Inspections</h2>
              {grouped[siteIns].length > 0 ? (
                  <ul className="space-y-1 mb-2 bg-sky-500/5 p-2 rounded-md">
                    {grouped[siteIns].map((c, i) => (
                      <li key={i} className="text-sm flex flex-col gap-2 ml-2">
                        <span className="font-medium">{c.subcategory || ''}:</span>
                        <span className="font-medium text-gray-500 ml-2">{c.field}</span>
                        <div className='flex flex-wrap ml-4'>
                          <span className="text-red-600 ">{c.from ?? '---'} </span>
                          <span className='mx-2'>→</span>
                          <span className="text-green-600">{c.to ?? '---'}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm mb-2 ml-2">No changes in this section.</p>
                )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-2">{postIns}</h2>
              {grouped[postIns].length > 0 ? (
                  <ul className="space-y-1 mb-4 bg-sky-500/5 p-2 rounded-md">
                    {grouped[postIns].map((c, i) => (
                      <li key={i} className="text-sm flex flex-col gap-2">
                        <span className="font-medium text-gray-700">{c.field}:</span>
                        <span className="text-red-600 border-2 border-dashed ml-4 p-1">{c.from ?? '---'}</span>
                        <span className="text-green-600 border-2 border-dashed ml-4 p-1">{c.to ?? '---'}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm mb-2 ml-2">No changes in this section.</p>
                )}
            </div>
          </div>
        );
      })}
      <button
        onClick={() => router.push(`/projects/${id}/inspections/${inspectionId}`)}
        className="bg-gray-700 text-white py-2 px-6 rounded hover:bg-gray-800"
      >
        ← Back
      </button>
    </div>
  );
}
