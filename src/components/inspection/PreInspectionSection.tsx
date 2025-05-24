"use client";

import { inspectionSchema } from '@/config/inspectionSchema';

interface PreInspectionSectionProps {
  data: any;
  onChange: (data: any) => void;
}

export default function PreInspectionSection({ data, onChange }: PreInspectionSectionProps) {
  const handleSelect = (field: string, value: boolean) => {
    onChange({ ...data, [field]: value ? 1 : 0 });
  };
  const sortedFields = [...inspectionSchema.preInspection].sort((a, b) => a.order - b.order);

  const midpoint = Math.ceil(sortedFields.length / 2);
  const leftColumn = sortedFields.slice(0, midpoint);
  const rightColumn = sortedFields.slice(midpoint);

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Pre-Inspection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[leftColumn, rightColumn].map((column, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            {column.map(({ name, label }) => (
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
        ))}
      </div>
    </div>
  );
}