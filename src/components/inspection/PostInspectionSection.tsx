"use client";

import { inspectionSchema } from '@/config/inspectionSchema';

interface PostInspectionSectionProps {
  data: any;
  onChange: (data: any) => void;
}

export default function PostInspectionSection({ data, onChange }: PostInspectionSectionProps) {
  const handleInput = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const sortedFields = [...inspectionSchema.postInspection].sort((a, b) => a.order - b.order);
  const midpoint = Math.ceil(sortedFields.length / 2);
  const leftColumn = sortedFields.slice(0, midpoint);
  const rightColumn = sortedFields.slice(midpoint);

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Post-Inspection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[leftColumn, rightColumn].map((column, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            {column.map(({ name, label, type }) => (
              <div key={name} className="flex flex-col">
                <label className="font-semibold text-base">{label}</label>
                {type === 'date' ? (
                  <input
                    type="date"
                    value={data[name] || ''}
                    onChange={(e) => handleInput(name, e.target.value)}
                    className="border p-2 rounded font-extrabold text-gray-500"
                  />
                ) : (
                  <textarea
                    value={data[name] || ''}
                    onChange={(e) => handleInput(name, e.target.value)}
                    className="border p-2 rounded font-extrabold text-gray-500 resize-none bg-slate-50"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
