"use client";
import { useState } from 'react';

interface ProjectInformationSectionProps {
  data: any;
  onChange: (data: any) => void;
}

const projectInfoFieldsOne = [
  { name: 'project_name', label: 'Project Name' },
  { name: 'inspection_date', label: 'Inspection Date', type: 'date' },
  { name: 'client', label: 'Client' },
  { name: 'client_contact', label: 'Client Contact & Title' },
  { name: 'client_rep', label: 'Client Site Rep & Title' },
  { name: 'installer', label: 'Installer/contractor' },
  { name: 'third_party_acr', label: '3rd Party Acr. Body' },
  { name: 'storeys', label: 'Storeys', type: 'number' },
];
const projectInfoFieldsTwo = [
  { name: 'structural_frame', label: 'Structural Frame' },
  { name: 'façade', label: 'Façade' },
  { name: 'floor_type', label: 'Floor Type' },
  { name: 'internal_walls', label: 'Internal Walls Types' },
  { name: 'fire_stopping_materials', label: 'Fire Stopping Materials' },
  { name: 'barrier_materials', label: 'Barrier Materials' },
  { name: 'dampers', label: 'Dampers' },
  { name: 'encasements', label: 'Encasements' },
];
const digital_recording = {name: 'digital_recording', label: 'Digital Recording'}

export default function ProjectInformationSection({ data, onChange }: ProjectInformationSectionProps) {
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: field === 'digital_recording' ? Number(value) : value });

    if (field === 'project_name' && value.trim() === '') {
      setErrors((prev) => ({ ...prev, project_name: 'Project name is required' }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">✅ Project Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3"> 
        
        <div className="flex flex-col gap-2">
          {projectInfoFieldsOne.map(({ name, label, type }) => (
            <div key={name} className="flex flex-col">
              <label className="font-semibold text-base">{label}</label>
              <input
                type={type || 'text'}
                value={data[name] ?? ''}
                onChange={(e) => handleChange(name, e.target.value)}
                className="border p-2 rounded bg-slate-50 font-extrabold text-gray-500"
              />
              {errors[name] && <span className="text-red-600 text-sm mt-1">{errors[name]}</span>}
            </div>
          ))}

          <div className="flex flex-col">
            <label className="font-semibold text-base">{digital_recording.label}</label>
            <select
              value={String(data.digital_recording ?? 0)}
              onChange={(e) => handleChange(digital_recording.name, e.target.value)}
              className="border p-2 rounded bg-slate-50 font-extrabold text-gray-500"
            >
              <option value="1">✅ Yes</option>
              <option value="0">❌ No</option>
            </select>
          </div>
        </div>
        
        <div className='flex flex-col gap-2'>
          {projectInfoFieldsTwo.map(({ name, label }) => (
            <div key={name} className="flex flex-col ">
              <label className="font-semibold text-base">{label}</label>
              <input
                value={data[name] ?? ''}
                onChange={(e) => handleChange(name, e.target.value)}
                className="border p-2 rounded bg-slate-50 font-extrabold text-gray-500"
              />
              {errors[name] && <span className="text-red-600 text-sm mt-1">{errors[name]}</span>}
            </div>
          ))}
        </div>        
      </div>
    </div>
  );
}
