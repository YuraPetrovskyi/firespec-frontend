'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

// import axios from 'axios';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

import ProtectedLayout from "@/components/layouts/ProtectedLayout";

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
  label?: string;
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
        .get(`projects/${id}/inspections/${inspectionId}/logs`)
        .then((res) => {
          setLogs(res.data.data);
          console.log('logs', res.data.data); 
        })
        .catch(() => toast.error('❌ Failed to load logs'))
        .finally(() => setLoading(false));
    }
  }, [id, inspectionId]);

  return (
    <ProtectedLayout>
      {loading 
        ?
          <p className="p-10 text-lg text-center animate-pulse text-blue-700">Loading logs...</p>
        : logs.length !== 0 
          ?
            <div className="p-6 max-w-5xl mx-auto space-y-8 pb-20">
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Change logs</h1>
        
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
        
                    {/* Pre-Inspection */}
                    <div>
                      <h2 className="text-xl font-semibold text-blue-700 mb-2">{preIns}</h2>
                      {grouped[preIns].length > 0 ? (
                          <ul className="space-y-1 mb-2 bg-sky-500/5 p-2 rounded-md">
                            {grouped[preIns].map((c, i) => (
                              <li key={i} className="text-sm flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                <div className='flex flex-wrap gap-2 ml-2'>
                                  <div className="font-medium text-gray-500">{c.label}: </div>
                                  <div className='flex flex-wrap ml-2'>
                                    <span className='text-red-600'>{c.from == 0 ? 'no' : 'yes'}</span>
                                    <span className='mx-2'>→</span>
                                    <span className='text-green-600'>{c.to == 0 ? 'no' : 'yes'}</span>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-400 text-sm mb-2 ml-2">No changes in this section.</p>
                        )}
                    </div>
        
                    {/* Project Information */}
                    <div>
                      <h2 className="text-xl font-semibold text-blue-700 mb-2">{projInf}</h2>
                      {grouped[projInf].length > 0 ? (
                          <ul className="space-y-1 mb-2 bg-sky-500/5 p-2 rounded-md">
                            {grouped[projInf].map((c, i) => (
                              <li key={i} className="text-sm flex flex-col gap-2 ml-2">
                                {
                                  String(c.field).includes("digital_recording") 
                                    ? 
                                    <div className='flex flex-wrap gap-2'>
                                      <span className="font-medium text-gray-500">{c.label}:</span>
                                      <div className='flex flex-wrap ml-2'>
                                        <span className="text-red-600 ">{c.from == 0 ? 'no' : 'yes'}</span>
                                        <span className='mx-2'>→</span>
                                        <span className="text-green-600">{c.to == 0 ? 'no' : 'yes'}</span>
                                      </div>
                                    </div> 
                                    :                        
                                  <div className='flex flex-wrap gap-2'>
                                    <span className="font-medium text-gray-500">{c.label}:</span>
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
        
                    {/* Site Inspections */}
                    <div>
                      <h2 className="text-xl font-semibold text-blue-700 mb-2">{siteIns}</h2>
                      {grouped[siteIns].length > 0 ? (
                        <div className="space-y-4 bg-sky-500/5 p-3 rounded-md">
        
                          {/* 🔹 Групування за subcategory */}
                          {Object.entries(
                            grouped[siteIns].reduce((acc: Record<string, Change[]>, change) => {
                              const key = change.subcategory || 'Uncategorized';
                              if (!acc[key]) acc[key] = [];
                              acc[key].push(change);
                              return acc;
                            }, {})
                          ).map(([subcategory, items]) => (
                            <div key={subcategory}>
                              <h3 className="font-semibold text-gray-800 mb-1">{subcategory}</h3>
                              <ul className="space-y-1 ml-4">
                                {items.map((c, i) => (
                                  <li key={i} className="text-sm flex flex-wrap gap-2">
                                    <span className="text-gray-600">{c.field}:</span>
                                    <div className='flex flex-wrap ml-2'>
                                      <span className="text-red-600 ml-2">{c.from ?? '---'}</span>
                                      <span className="mx-1">→</span>
                                      <span className="text-green-600">{c.to ?? '---'}</span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
        
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm mb-2 ml-2">No changes in this section.</p>
                      )}
                    </div>
        
                    {/* Post-Inspection */}
                    <div>
                      <h2 className="text-xl font-semibold text-blue-700 mb-2">{postIns}</h2>
                      {grouped[postIns].length > 0 ? (
                          <ul className="space-y-1 mb-4 bg-sky-500/5 p-2 rounded-md break-words">
                            {grouped[postIns].map((c, i) => (
                              <li key={i} className="text-sm flex flex-col gap-2">
                                <span className="font-medium text-gray-700">{c.label}:</span>
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
              
            </div>
          : 
            <p className="p-8 text-lg text-center text-gray-500">No change logs found for this inspection.</p>
      }
      <button
        onClick={() => router.back()}
        className="bg-gray-700 text-white py-2 px-6 rounded hover:bg-gray-800 fixed bottom-3 left-3"
      >
        Back
      </button>
    </ProtectedLayout>
  );
}
