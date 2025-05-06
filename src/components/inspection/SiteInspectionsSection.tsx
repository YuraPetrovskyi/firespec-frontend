"use client";

interface SiteInspectionsSectionProps {
  data: any;
  onChange: (data: any) => void;
}

const siteInspectionCategories = [
  { name: 'Encasements', options: ['thickness', 'fixing(type/centres/orientation)', 'framing', 'joints', 'junctions', 'overlaps', 'any penetrations'] },
  { name: 'Wall Makeup', options: ['Layers', 'thickness', 'framing system'] },
  { name: 'Letterbox Openings', options: ['framing', 'lining', 'tape & jointing'] },
  { name: 'Linear Joint Seals', options: ['compression', 'gap size', 'depth', 'sealant', 'backing material'] },
  { name: 'Trapezoidal Voids', options: ['Infilled', 'sealant'] },
  { name: 'Fire Stopping, Friction Fitted', options: ['opening (size/spacing etc)', 'service spacing', 'layers', 'edge/joint coating', 'lagging', 'closure devices', 'service supports', 'fitted e/s', 'fixings'] },
  { name: 'Fire Stopping, Horizontal', options: ['substrate', 'shutter', 'layers', 'depth', 'closure devices', 'fixings'] },
  { name: 'Fire Stopping, Face Fixed', options: ['fixings', 'overlaps', 'service spacing', 'closure devices', 'lagging', 'edge coating', 'service supports'] },
  { name: 'Fire Stopping, Direct Seal', options: ['size', 'annulus', 'depth'] },
  { name: 'Fire Stopping, Closure Devices', options: ['pipe/insulation type/diameter', 'annulus', 'depth', 'layers', 'fixings', 'diameter', 'fitted to plain pipe'] },
  { name: 'Dampers', options: ['opening (size/spacing etc)', 'opening infill', 'dimensions to casing', 'fixings', 'supports', 'plasterboard pattress'] },
  { name: 'Putty Pads', options: ['sealed'] },
  { name: 'Cavity Barriers, Ceiling Void', options: ['substrate', 'brackets', 'fixings', 'joints', 'overlaps', 'stitching', 'stapling', 'penetrations'] },
  { name: 'Cavity Barriers, RAF', options: ['compression', 'brackets', 'fixings', 'joints', 'sealants', 'tapes'] },
  { name: 'Cavity Barriers External', options: ['substrate', 'compression', 'brackets', 'fixings', 'joints', 'sealants', 'tapes'] },
  { name: 'Destructive Tests', options: ['Carried Out?'] },
];

export default function SiteInspectionsSection({ data, onChange }: SiteInspectionsSectionProps) {
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

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">✅ Site Inspections</h2>

      <div className="flex flex-col gap-6">
        {siteInspectionCategories.map((category) => {
          // const isDestructive = category.name === 'Destructive Tests Carried out?';
          const categoryData = data[category.name] || {};
          const mainStatus = categoryData.main || 'not_checked';

          return (
            <div key={category.name} className="border p-4 rounded shadow-sm bg-slate-50">
              <details className="">
                <summary className="cursor-pointer select-none">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-gray-800 mb-2">{category.name}</h3>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ml-1 ${
                        mainStatus === 'checked' ? 'text-green-800 bg-green-100 w-[110px] text-center' : 'text-red-600 bg-red-100 w-[110px] text-center'
                      }`}
                    >
                      {mainStatus}
                    </span>
                  </div>
                </summary>

                <div>
                  <div className="flex flex-wrap gap-6">
                  {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 bg-green-100"> */}

                    {category.options.map((option) => (
                      <div key={option} className="flex flex-col ">
                        <label className="font-semibold text-gray-500">{option}</label>
                        <select
                          value={categoryData[option] || 'not_selected'}
                          onChange={(e) => handleOptionStatusChange(category.name, option, e.target.value)}
                          className="border p-2 rounded w-[160px]"
                        >
                          <option value="not_selected">-- Select --</option>
                          {category.name === 'Destructive Tests' && option === 'Carried Out?' ? (
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
  
                  <button
                    type="button"
                    onClick={() => clearAllOptions(category.name, category.options)}
                    className="mt-4 text-sm text-red-600 hover:underline"
                  >
                    🧹 Clear all options
                  </button>
                </div>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
}
