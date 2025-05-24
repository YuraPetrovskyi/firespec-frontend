"use client";

import { useState } from 'react';
import { inspectionSchema } from '@/config/inspectionSchema';

interface ProjectInformationSectionProps {
  data: any;
  onChange: (data: any) => void;
}

export default function ProjectInformationSection({ data, onChange }: ProjectInformationSectionProps) {
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

  const handleChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: field === 'digital_recording' ? Number(value) : value
    });

    if (field === 'project_name' && value.trim() === '') {
      setErrors((prev) => ({ ...prev, project_name: 'Project name is required' }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const filteredFields = inspectionSchema.projectInformation
    .filter((field) => field.name !== 'inspection_number') // виключаємо номер
    .sort((a, b) => a.order - b.order);

  const midpoint = Math.ceil(filteredFields.length / 2);
  const leftColumn = filteredFields.slice(0, midpoint);
  const rightColumn = filteredFields.slice(midpoint);

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Project Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[leftColumn, rightColumn].map((column, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            {column.map(({ name, label, type }) => (
              <div key={name} className="flex flex-col">
                <label className="font-semibold text-base">{label}</label>

                {name === 'digital_recording' ? (
                  <select
                    value={String(data[name] ?? 0)}
                    onChange={(e) => handleChange(name, e.target.value)}
                    className="border p-2 rounded bg-slate-50 font-extrabold text-gray-500"
                  >
                    <option value="1">✅ Yes</option>
                    <option value="0">❌ No</option>
                  </select>
                ) : (
                  <input
                    type={type || 'text'}
                    value={data[name] ?? ''}
                    onChange={(e) => handleChange(name, e.target.value)}
                    className="border p-2 rounded bg-slate-50 font-extrabold text-gray-500"
                  />
                )}

                {errors[name] && <span className="text-red-600 text-sm mt-1">{errors[name]}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}