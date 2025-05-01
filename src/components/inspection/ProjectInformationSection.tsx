"use client";

interface ProjectInformationSectionProps {
  data: any;
  onChange: (data: any) => void;
}

const projectInfoFields = [
  { name: 'project_name', label: 'Project Name' },
  { name: 'inspection_date', label: 'Inspection Date', type: 'date' },
  { name: 'client', label: 'Client' },
  { name: 'client_contact', label: 'Client Contact & Title' },
  { name: 'client_rep', label: 'Client Site Rep & Title' },
  { name: 'installer', label: 'Installer/contractor' },
  { name: 'third_party_acr', label: '3rd Party Acr. Body' },
  { name: 'storeys', label: 'Storeys', type: 'number' },
  { name: 'structural_frame', label: 'Structural Frame' },
  { name: 'façade', label: 'Façade' },
  { name: 'floor_type', label: 'Floor Type' },
  { name: 'internal_walls', label: 'Internal Walls Types' },
  { name: 'fire_stopping_materials', label: 'Fire Stopping Materials' },
  { name: 'barrier_materials', label: 'Barrier Materials' },
  { name: 'dampers', label: 'Dampers' },
  { name: 'encasements', label: 'Encasements' },
];

export default function ProjectInformationSection({ data, onChange }: ProjectInformationSectionProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">✅ Project Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projectInfoFields.map(({ name, label, type }) => (
          <div key={name} className="flex flex-col">
            <label className="font-semibold mb-1">{label}</label>
            <input
              type={type || 'text'}
              value={data[name] ?? ''}
              onChange={(e) => handleChange(name, e.target.value)}
              className="border p-2 rounded"
            />
          </div>
        ))}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Digital Recording</label>
          <select
            value={data.digital_recording ?? ''}
            onChange={(e) => handleChange('digital_recording', e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">-- Select --</option>
            <option value="1">✅ Yes</option>
            <option value="0">❌ No</option>
          </select>
        </div>
      </div>
    </div>
  );
}
