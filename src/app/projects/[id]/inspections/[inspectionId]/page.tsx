'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import ModalConfirm from '@/components/ModalConfirm';

const siteInspectionCategories = [
  'Encasements',
  'Wall Makeup',
  'Letterbox Openings',
  'Linear Joint Seals',
  'Trapezoidal Voids',
  'Fire Stopping, Friction Fitted',
  'Fire Stopping, Horizontal',
  'Fire Stopping, Face Fixed',
  'Fire Stopping, Direct Seal',
  'Fire Stopping, Closure Devices',
  'Dampers',
  'Putty Pads',
  'Cavity Barriers, Ceiling Void',
  'Cavity Barriers, RAF',
  'Cavity Barriers External',
  'Destructive Tests',
];

export default function ViewInspectionPage() {
  const { id, inspectionId } = useParams();
  const router = useRouter();

  const [inspection, setInspection] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (id && inspectionId) {
      axios
        .get(`http://127.0.0.1:8000/api/projects/${id}/inspections/${inspectionId}`)
        .then((res) => setInspection(res.data.data))
        .catch(() => toast.error('❌ Failed to load inspection'));
    }
  }, [id, inspectionId]);

  if (!inspection) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  const { pre_inspection, project_information, site_inspections, post_inspection, inspection_number } = inspection;
  console.log('Inspection data:', inspection);

  const handleDeleteInspection = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/projects/${id}/inspections/${inspectionId}`);
      toast.success('✅ Inspection deleted!');
      router.push(`/projects/${id}/inspections`);
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to delete inspection');
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center mb-8">Inspection Details</h1>
      <div className='flex justify-between items-center gab-2'>
        <button
          onClick={() => router.push(`/projects/${id}/inspections`)}
          className="bg-gray-700 text-white py-2 px-6 rounded hover:bg-gray-800"
        >
          ← Back
        </button>
        <button
          onClick={() => router.push(`/projects/${id}/inspections/${inspectionId}/edit`)}
          className="bg-yellow-500 text-white py-2 px-6 rounded hover:bg-yellow-600"
        >
          ✏️ Edit
        </button>
      </div>

      {/* ✅ PRE-INSPECTION */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">✅ Pre-Inspection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'RAMS information submitted', field: 'rams_info_submitted' },
            { label: 'Induction arranged', field: 'induction_arranged' },
            { label: 'Induction attended', field: 'induction_attended' },
            { label: 'PPE (incl glasses and sleeves for Wates)', field: 'ppe_checked' },
            { label: 'Meet with client representative', field: 'client_meeting' },
            { label: 'Latest fire strategy drawings available', field: 'fire_drawings_available' },
            { label: 'Bolster uploads completed', field: 'bolster_uploads' },
            { label: 'Bolster down synced and checked', field: 'bolster_synced' },
            { label: 'Latest Manufacturer ETAs', field: 'latest_eta_available' },
            { label: 'Walk through and cursory inspection', field: 'walkthrough_done' },
          ].map(({ label, field }) => (
            <div key={field} className="flex justify-between items-center border-b py-2">
              <span>{label}</span>
              <span className={`px-3 py-1 rounded text-white ${pre_inspection?.[field] ? 'bg-green-600' : 'bg-red-500'}`}>
                {pre_inspection?.[field] ? 'Yes' : 'No'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ PROJECT INFORMATION */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">✅ Project Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Project Name', value: project_information?.project_name },
            { label: 'Inspection Date', value: project_information?.inspection_date },
            { label: 'Inspection Number', value: inspection_number },
            { label: 'Client', value: project_information?.client },
            { label: 'Client Contact & Title', value: project_information?.client_contact },
            { label: 'Client Site Rep & Title', value: project_information?.client_rep },
            { label: 'Installer/contractor', value: project_information?.installer },
            { label: '3rd Party Acr. Body', value: project_information?.third_party_acr },
            { label: 'Digital Recording', value: project_information?.digital_recording ? 'Yes' : 'No' },
            { label: 'Storeys', value: project_information?.storeys },
            { label: 'Structural Frame', value: project_information?.structural_frame },
            { label: 'Façade', value: project_information?.façade },
            { label: 'Floor Type', value: project_information?.floor_type },
            { label: 'Internal Walls Types', value: project_information?.internal_walls },
            { label: 'Fire Stopping Materials', value: project_information?.fire_stopping_materials },
            { label: 'Barrier Materials', value: project_information?.barrier_materials },
            { label: 'Dampers', value: project_information?.dampers },
            { label: 'Encasements', value: project_information?.encasements },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center border-b py-2">
              <span>{label}</span>
              <span>{value ?? 'N/A'}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ SITE INSPECTIONS */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">✅ Site Inspections</h2>
        <div className="flex flex-col gap-4">
          {siteInspectionCategories.map((category) => {
            const options = site_inspections?.[category] || {};
            const mainStatus = options.main || options.result || 'not_checked';
            const isChecked = mainStatus === 'checked' || mainStatus === 'yes';

            return (
              <div key={category} className="border rounded p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{category}</h3>
                  <span className={`px-3 py-1 rounded text-white ${isChecked ? 'bg-green-600' : 'bg-red-500'}`}>
                    {mainStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {isChecked && Object.entries(options).filter(([k]) => k !== 'main' && k !== 'result').length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {Object.entries(options)
                      .filter(([key]) => key !== 'main' && key !== 'result')
                      .map(([option, status]) => {
                        let badgeColor = 'bg-gray-400';
                        switch (status) {
                          case 'checked':
                          case 'yes':
                            badgeColor = 'bg-green-500';
                            break;
                          case 'not_checked':
                          case 'no':
                            badgeColor = 'bg-red-500';
                            break;
                          case 'absent':
                            badgeColor = 'bg-black';
                            break;
                          case 'not_required':
                          case 'not_applicable':
                            badgeColor = 'bg-yellow-500';
                            break;
                        }

                        return (
                          <div key={option} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                            <span>{option}</span>
                            <span className={`font-semibold text-white py-1 px-3 rounded ${badgeColor}`}>
                              {String(status)}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ✅ POST-INSPECTION */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">✅ Post-Inspection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Meet with Client Representative', value: post_inspection?.client_meeting_done },
            { label: 'Communicate Urgent Matters', value: post_inspection?.urgent_matters },
            { label: 'Date of Next Inspection Visit', value: post_inspection?.next_inspection_date },
            { label: 'Up-sync Bolster', value: post_inspection?.bolster_notes },
            { label: 'Comment', value: post_inspection?.comment },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center border-b py-2">
              <span>{label}</span>
              <span>{value ?? 'N/A'}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 🔘 КНОПКИ */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">

        <button
          onClick={() => router.push(`/projects/${id}/inspections`)}
          className="bg-gray-700 text-white py-2 px-6 rounded hover:bg-gray-800"
        >
          ← Back
        </button>
        <button
          onClick={() => router.push(`/projects/${id}/inspections/${inspectionId}/edit`)}
          className="bg-yellow-500 text-white py-2 px-6 rounded hover:bg-yellow-600"
        >
          ✏️ Edit
        </button>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition mt-2"
        >
          🗑️ Delete
        </button>
        <button
          onClick={() => router.push(`/projects/${id}/inspections/${inspectionId}/logs`)}
          className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition"
        >
          🕒 View Change Log
        </button>

      </div>

      {modalOpen && (
        <ModalConfirm
          message="Are you sure you want to delete this inspection?"
          onConfirm={handleDeleteInspection}
          onCancel={() => setModalOpen(false)}
        />
      )}

    </div>
  );
}
