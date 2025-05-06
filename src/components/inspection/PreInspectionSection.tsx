"use client";

interface PreInspectionSectionProps {
  data: any;
  onChange: (data: any) => void;
}

const preInspectionFieldsOne = [
  { name: 'rams_info_submitted', label: 'RAMS information submitted' },
  { name: 'induction_arranged', label: 'Induction arranged' },
  { name: 'induction_attended', label: 'Induction attended' },
  { name: 'ppe_checked', label: 'PPE (incl glasses and sleeves for Wates)' },
  { name: 'client_meeting', label: 'Meet with client representative' },
];

const preInspectionFieldsTwo = [
  { name: 'fire_drawings_available', label: 'Latest fire strategy drawings available' },
  { name: 'bolster_uploads', label: 'Bolster uploads completed' },
  { name: 'bolster_synced', label: 'Bolster down synced and checked' },
  { name: 'latest_eta_available', label: 'Latest Manufacturer ETAs' },
  { name: 'walkthrough_done', label: 'Walk through and cursory inspection' },
];

export default function PreInspectionSection({ data, onChange }: PreInspectionSectionProps) {
  const handleSelect = (field: string, value: boolean) => {
    onChange({ ...data, [field]: value ? 1 : 0 });
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">✅ Pre-Inspection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          {preInspectionFieldsOne.map(({ name, label }) => (
            <div key={name} className="flex flex-col">
              <label className="font-extrabold text-base">{label}</label>
              <select
                value={data[name] ?? ''}
                onChange={(e) => handleSelect(name, e.target.value === '1')}
                className="border p-2 rounded bg-slate-50 font-extrabold text-gray-500"
              >
                <option value="">-- Select --</option>
                <option value="1">✅ Yes</option>
                <option value="0">❌ No</option>
              </select>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {preInspectionFieldsTwo.map(({ name, label }) => (
            <div key={name} className="flex flex-col">
              <label className="font-extrabold text-base">{label}</label>
              <select
                value={data[name] ?? ''}
                onChange={(e) => handleSelect(name, e.target.value === '1')}
                className="border p-2 rounded bg-slate-50 font-extrabold text-gray-500"
              >
                <option value="">-- Select --</option>
                <option value="1">✅ Yes</option>
                <option value="0">❌ No</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
