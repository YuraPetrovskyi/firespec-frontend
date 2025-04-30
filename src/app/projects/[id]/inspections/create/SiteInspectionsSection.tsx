"use client";

interface SiteInspectionsSectionProps {
  data: any;
  onChange: (data: any) => void;
}

// Категорії з підопціями
const siteInspectionCategories = [
  { name: 'Encasements', options: ['thickness', 'fixing type/centres/orientation', 'framing', 'joints', 'junctions', 'overlaps', 'any penetrations'] },
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
  { name: 'Destructive Tests Carried out?', options: [] },
];

export default function SiteInspectionsSection({ data, onChange }: SiteInspectionsSectionProps) {

  const handleMainStatusChange = (category: string, value: string) => {
    const updated = { ...data };
    updated[category] = { ...(updated[category] || {}), main: value };
    onChange(updated);
  };

  const handleOptionStatusChange = (category: string, optionName: string, value: string) => {
    const updated = { ...data };
    if (!updated[category]) {
      updated[category] = {};
    }
    updated[category][optionName] = value;
    onChange(updated);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">✅ Site Inspections</h2>

      <div className="flex flex-col gap-6">
        {siteInspectionCategories.map((category) => {
          const isDestructive = category.name === 'Destructive Tests Carried out?';
          const mainStatus = data[category.name]?.main || 'not_checked';

          return (
            <div key={category.name} className="border p-4 rounded shadow-sm">
              {/* Заголовок + головний перемикач */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">{category.name}</h3>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={mainStatus === 'checked'}
                    onChange={(e) => handleMainStatusChange(category.name, e.target.checked ? 'checked' : 'not_checked')}
                    className="w-5 h-5"
                  />
                </label>
              </div>

              {/* Підпункти */}
              {!isDestructive && mainStatus === 'checked' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.options.map((option) => (
                    <div key={option} className="flex flex-col">
                      <label className="font-semibold mb-1">{option}</label>
                      <select
                        value={data[category.name]?.[option] || ''}
                        onChange={(e) => handleOptionStatusChange(category.name, option, e.target.value)}
                        className="border p-2 rounded w-[180px]"
                      >
                        <option value="">-- Select --</option>
                        <option value="checked">✅ Checked</option>
                        <option value="not_checked">❔ Not Checked</option>
                        <option value="not_required">❌ Not Required</option>
                        <option value="absent">⚪ Absent</option>
                        <option value="not_applicable">⛔ Not Applicable</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
