'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import ProtectedLayout from "@/components/layouts/ProtectedLayout";

import ModalConfirm from '@/components/ModalConfirm';
import { inspectionSchema } from '@/config/inspectionSchema';
import LoadSpinner from '@/components/LoadSpinner';
import { loadEditInspectionFromLocal } from '@/lib/inspectionLocalStorage';

export default function ViewInspectionPage() {
  const { id, inspectionId } = useParams();
  const router = useRouter();

  const [inspection, setInspection] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasUnsavedEdit, setHasUnsavedEdit] = useState(false);

  useEffect(() => {
    if (id && inspectionId) {

    const saved = loadEditInspectionFromLocal(id as string, inspectionId as string);
    const isValidDraft = saved && Object.keys(saved.projectInformation || {}).length > 1;
    setHasUnsavedEdit(isValidDraft);

    axios
      .get(`projects/${id}/inspections/${inspectionId}`)
      .then((res) => setInspection(res.data.data))
      .catch(() => toast.error('❌ Failed to load inspection'));
    }
  }, [id, inspectionId]);

  if (!inspection) {
    return (
      <ProtectedLayout>
        <LoadSpinner />
      </ProtectedLayout>);
  }

  const { pre_inspection, project_information, site_inspections, post_inspection, inspection_number } = inspection;
  // console.log('Inspection data:', inspection);

  const handleDeleteInspection = async () => {
    try {
      await axios.delete(`projects/${id}/inspections/${inspectionId}`);
      toast.success('Inspection deleted!');
      router.push(`/projects/${id}/inspections`);
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to delete inspection');
    } finally {
      setModalOpen(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(
        `projects/${id}/inspections/${inspectionId}/export`,
        { responseType: 'blob' }
      );

      // Створення URL з blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Вручну сформуй назву файла з inspection_number
      const filename = `inspection_${inspection.inspection_number}.xlsx`;

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("❌ Export failed", error);
      toast.error("Failed to export Excel file");
    }
  };


  return (
    <ProtectedLayout>      
      <div className="p-5 min-h-screen flex flex-col gap-8 pb-20 max-w-[1250px] mx-auto">
        
        <div>
          <h1 className="text-3xl font-bold text-center mb-2">INSPECTIONS DETAILS</h1>
          {hasUnsavedEdit && (
            <div className="text-yellow-800 bg-yellow-100 border border-yellow-400 px-4 py-2 rounded text-center mb-4">
              ⚠️ You have unsaved edits for this inspection.
            </div>
          )} 
          <div className="flex flex-wrap justify-between gap-4 mt-8"> 
            <button
              onClick={() => setModalOpen(true)}
              className="bg-red-600 text-white py-2 px-6 rounded
                hover:bg-red-700 hover:scale-105 active:scale-95 hover:shadow-lg transition duration-100"
            >
              Delete
            </button>
            
            <button
              onClick={() => router.push(`/projects/${id}/inspections/${inspectionId}/logs`)}
              className="bg-green-500/60 text-white py-2 px-6 rounded
                hover:bg-green-700 hover:scale-105 active:scale-95 hover:shadow-lg transition duration-100"
            >
              View Change Log
            </button>
        </div>
          
        </div>
  
        {/* ✅ PRE-INSPECTION */}
        <section className="bg-white rounded shadow">
          <h2 className="text-2xl font-semibold bg-gray-600 text-white p-4 rounded-t">Pre-Inspection</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 p-2 ">
            {[...Array(2)].map((_, colIdx) => {
              const sortedFields = [...inspectionSchema.preInspection].sort((a, b) => a.order - b.order);
              const midpoint = Math.ceil(sortedFields.length / 2);
              const column = colIdx === 0 ? sortedFields.slice(0, midpoint) : sortedFields.slice(midpoint);

              return (
                <div key={colIdx} className="flex flex-col gap-3">
                  {column.map(({ name, label }) => (
                    <div key={name} className="flex justify-between items-center border-b py-2 mx-2 gap-2">
                      <div className='font-extrabold text-gray-800'>{label}</div>
                      <div className={`min-w-[60px] px-3 py-1 rounded text-white text-center ${pre_inspection?.[name] ? 'bg-green-600' : 'bg-red-500'}`}>
                        {pre_inspection?.[name] ? 'Yes' : 'No'}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </section>
  
        {/* ✅ PROJECT INFORMATION */}
        <section className="bg-white rounded shadow">
          <h2 className="text-2xl font-semibold bg-gray-600 text-white p-4 rounded-t">Project Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
            {[...inspectionSchema.projectInformation]
              .sort((a, b) => a.order - b.order)
              .reduce<[typeof inspectionSchema.projectInformation, typeof inspectionSchema.projectInformation]>(
                (acc, field, index, arr) => {
                  const midpoint = Math.ceil(arr.length / 2);
                  (index < midpoint ? acc[0] : acc[1]).push(field);
                  return acc;
                },
                [[], []]
              )
              .map((columnFields, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-2">
                  {columnFields.map(({ name, label, type }) => {
                    const value =
                      name === 'inspection_number'
                        ? inspection.inspection_number
                        : project_information?.[name];
                    const displayValue =
                      type === 'date' && value
                        ? new Date(value).toLocaleDateString()
                        : typeof value === 'boolean' || value === 1 || value === 0
                          ? value ? 'Yes' : 'No'
                          : value ?? 'N/A';

                    return (
                      <div key={name} className="flex flex-row border-b py-2 mx-2 gap-4">
                        <span className="font-extrabold text-gray-800 overflow-hidden text-ellipsis border-r p-1 basis-1/3 min-w-[130px]">
                          {label}
                        </span>
                        <span className="overflow-hidden text-ellipsis text-gray-500 text-left basis-2/3">
                          {displayValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
          </div>
        </section>
  
        {/* ✅ SITE INSPECTIONS */}
        <section className="bg-white rounded shadow">
          <h2 className="text-2xl font-semibold bg-gray-600 text-white p-4 rounded-t">Site Inspections</h2>
          <div className="flex flex-col gap-4 p-4">
            {inspectionSchema.siteInspections.sort((a, b) => a.order - b.order).map((category) => {
              const options = site_inspections?.[category.name] || {};
              const mainStatus = options.main || options.result || 'not_checked';
              const isChecked = mainStatus === 'checked' || mainStatus === 'yes';

              return (
                <div key={category.name} className="border rounded p-4 bg-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-base">{category.label}</h3>
                    <span className={`rounded min-w-[90px] text-right ${isChecked ? 'text-green-500' : 'text-red-500'}`}>
                      {mainStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {isChecked && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                      {category.options.map((option) => {
                        const status = options[option.name];
                        if (!status) return null;

                        let badgeColor = 'bg-gray-400';
                        switch (status) {
                          case 'checked':
                          case 'yes':
                            badgeColor = 'bg-green-500'; break;
                          case 'not_checked':
                          case 'no':
                            badgeColor = 'bg-red-500'; break;
                          case 'absent':
                            badgeColor = 'bg-black'; break;
                          case 'not_required':
                            badgeColor = 'bg-gray-500'; break;
                          case 'not_applicable':
                            badgeColor = 'bg-yellow-500'; break;
                        }

                        return (
                          <div key={option.name} className="flex flex-wrap justify-between items-center p-2 bg-gray-200 rounded shadow-sm">
                            <span className='overflow-hidden  text-ellipsis font-semibold text-gray-600'>{option.label}</span>
                            <span className={`font-semibold text-white text-center w-[120px] p-1 rounded ${badgeColor}`}>
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
        <section className="bg-white rounded shadow">
          <h2 className="text-2xl font-semibold bg-gray-600 text-white p-4 rounded-t">Post-Inspection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
            {inspectionSchema.postInspection
              .sort((a, b) => a.order - b.order)
              .map(({ name, label, type }) => {
                const value = post_inspection?.[name];
                const displayValue =
                  type === 'date' && value ? new Date(value).toLocaleDateString() :
                  typeof value === 'boolean' || value === 1 || value === 0
                    ? value ? 'Yes' : 'No'
                    : value ?? 'N/A';

                return (
                  <div key={name} className="flex border-b gap-2 bg-gray-100 rounded p-2">
                    <span className="font-semibold text-base basis-1/3 min-w-[140px] border-r">{label}</span>
                    <span className="text-gray-500 basis-2/3 ">{displayValue}</span>
                  </div>
                );
              })}
          </div>
        </section>

  
        {/* ✅ POST-INSPECTION */}
        <div className='flex justify-center'>
          <button
            onClick={handleExport}
            className="max-w:[140px] bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 hover:scale-105 active:scale-95 transition-transform duration-200"
          >
            Export to Excel
          </button>
        </div>

        <button
          onClick={() => router.push(`/projects/${id}/inspections`)}
          className=" bg-gray-700 text-white py-2 px-6 rounded
            hover:bg-gray-800 hover:scale-105 active:scale-95 transition-transform duration-200 fixed bottom-3 left-3"
        >
          Back
        </button>

        <button
          onClick={() => router.push(`/projects/${id}/inspections/${inspectionId}/edit`)}
          className="bg-yellow-600 text-white py-2 px-6 rounded
            hover:bg-yellow-800 hover:scale-105 active:scale-95 transition-transform duration-200 fixed bottom-3 right-3"
        >
          {hasUnsavedEdit ? 'Continue Editing' : 'Edit'}
        </button>       
  
        {modalOpen && (
          <ModalConfirm
            message="Are you sure you want to delete this inspection?"
            onConfirm={handleDeleteInspection}
            onCancel={() => setModalOpen(false)}
            nameAction="Delete"
            title="Delete Inspection"
          />
        )}
  
      </div>
    </ProtectedLayout>
  );
}
