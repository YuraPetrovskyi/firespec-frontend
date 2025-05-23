"use client";

import ModalConfirm from '@/components/ModalConfirm';
import { useState } from 'react';
import { inspectionSchema } from '@/config/inspectionSchema';

interface SiteInspectionsSectionProps {
  data: any;
  onChange: (data: any) => void;
}

export default function SiteInspectionsSection({ data, onChange }: SiteInspectionsSectionProps) {
  const [clearAgree, setClearAgree] = useState<string | null>(null);

  const updateMainStatus = (category: string, updatedOptions: Record<string, any>) => {
    const values = Object.entries(updatedOptions).filter(([key]) => key !== 'main');
    const hasSelected = values.some(([_, v]) => v && v !== 'not_selected');
    const main = hasSelected ? 'checked' : 'not_checked';

    return { ...updatedOptions, main };
  };

  const handleOptionStatusChange = (category: string, optionName: string, value: string) => {
    const updated = { ...data };
    const categoryData = updated[category] || {};
    categoryData[optionName] = value;
    updated[category] = updateMainStatus(category, categoryData);
    onChange(updated);
  };

  const clearAllOptions = (category: string, options: string[]) => {
    const cleared = options.reduce((acc, key) => ({ ...acc, [key]: 'not_selected' }), {});
    const updated = { ...data };
    updated[category] = updateMainStatus(category, cleared);
    onChange(updated);
  };

  const sortedCategories = inspectionSchema.siteInspections.sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Site Inspections</h2>

      <div className="flex flex-col gap-6">
        {sortedCategories.map((category) => {
          const categoryData = data[category.name] || {};
          const mainStatus = categoryData.main || 'not_checked';

          return (
            <div key={category.name} className="border p-4 rounded shadow-sm bg-slate-50">
              <details className="">
                <summary className="cursor-pointer select-none">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-gray-800 mb-2">{category.label}</h3>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ml-1 ${
                        mainStatus === 'checked'
                          ? 'text-green-800 bg-green-100 w-[110px] text-center'
                          : 'text-red-600 bg-red-100 w-[110px] text-center'
                      }`}
                    >
                      {mainStatus}
                    </span>
                  </div>
                </summary>

                <div>
                  <div className="flex flex-wrap gap-6">
                    {category.options.map((option) => (
                      <div key={option.name} className="flex flex-col">
                        <label className="font-semibold text-gray-500">{option.label}</label>
                        <select
                          value={categoryData[option.name] || 'not_selected'}
                          onChange={(e) => handleOptionStatusChange(category.name, option.name, e.target.value)}
                          className="border p-2 rounded w-[160px]"
                        >
                          <option value="not_selected">-- Select --</option>
                          {category.name === 'destructive_tests' && option.name === 'carried_out' ? (
                            <>
                              <option value="no">❌ No</option>
                              <option value="yes">✅ Yes</option>
                            </>
                          ) : (
                            <>
                              <option value="checked">✅ Checked</option>
                              <option value="not_checked">❔ Not Checked</option>
                              <option value="not_required">❌ Not Required</option>
                              <option value="absent">⚪ Absent</option>
                              <option value="not_applicable">⛔ Not Applicable</option>
                            </>
                          )}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="flex w-full justify-center items-center">
                    <button
                      type="button"
                      onClick={() => setClearAgree(category.name)}
                      className="mt-4 text-sm font-extrabold text-red-600 hover:underline"
                    >
                      Clear all options
                    </button>
                  </div>

                  {clearAgree === category.name && (
                    <ModalConfirm
                      message="Do you confirm clearing all options?"
                      title={`Clear ${category.label}`}
                      nameAction="Confirm"
                      confirmColor="red"
                      isAsync={false}
                      onConfirm={() => {
                        clearAllOptions(
                          category.name,
                          category.options.map((o) => o.name)
                        );
                        setClearAgree(null);
                      }}
                      onCancel={() => setClearAgree(null)}
                    />
                  )}
                </div>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
}
