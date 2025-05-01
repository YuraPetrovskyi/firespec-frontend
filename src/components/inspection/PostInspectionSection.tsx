"use client";

interface PostInspectionSectionProps {
  data: any;
  onChange: (data: any) => void;
}

export default function PostInspectionSection({ data, onChange }: PostInspectionSectionProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">✅ Post-Inspection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Date of next inspection visit</label>
          <input
            type="date"
            value={data.next_inspection_date ?? ''}
            onChange={(e) => handleChange('next_inspection_date', e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Meet with client representative</label>
          <input
            type="text"
            value={data.client_meeting_done ?? ''}
            onChange={(e) => handleChange('client_meeting_done', e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Communicate urgent matters</label>
          <input
            type="text"
            value={data.urgent_matters ?? ''}
            onChange={(e) => handleChange('urgent_matters', e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Up-sync Bolster</label>
          <input
            type="text"
            value={data.bolster_notes ?? ''}
            onChange={(e) => handleChange('bolster_notes', e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Comment</label>
          <input
            type="text"
            value={data.comment ?? ''}
            onChange={(e) => handleChange('comment', e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>
    </div>
  );
}
