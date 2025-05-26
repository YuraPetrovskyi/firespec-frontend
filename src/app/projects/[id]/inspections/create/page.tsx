'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import axiosInstance from '@/lib/axios';
import { AxiosError } from 'axios';
// import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { useAuth } from "@/context/AuthContext";
import PreInspectionSection from '@/components/inspection/PreInspectionSection';
import ProjectInformationSection from '@/components/inspection/ProjectInformationSection';
import SiteInspectionsSection from '@/components/inspection/SiteInspectionsSection';
import PostInspectionSection from '@/components/inspection/PostInspectionSection';
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import ModalConfirm from '@/components/ModalConfirm';

type ProjectData = {
  project_name: string;
  client: string;
};

type SectionData = {
  [key: string]: any;
};

type ValidationErrorResponse = {
  errors: Record<string, string[]>;
};

export default function CreateInspectionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [preInspection, setPreInspection] = useState<SectionData>({});
  const [projectInformation, setProjectInformation] = useState<SectionData>({});
  const [siteInspections, setSiteInspections] = useState<SectionData>({});
  const [postInspection, setPostInspection] = useState<SectionData>({});
  const [projectData, setProjectData] = useState<ProjectData>({ project_name: '', client: '' });
  const { user } = useAuth();
  const [cancelAgree, setCancelAgree] = useState(false);
  const [saveAgree, setSaveAgree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // утиліта для очищення службових полів
  const clean = (obj: any) => {
    if (!obj || typeof obj !== 'object') return {};
    const { id, created_at, updated_at, inspection_id, ...rest } = obj;
    return rest;
  };

  useEffect(() => {
    if (id) {
      // 1. Отримуємо дані про проєкт
      axiosInstance.get(`projects/${id}`)
        .then((res) => {
          const project = res.data.data;
          // console.log('Project data:', project);
          setProjectData({
            project_name: project.project_name || '',
            client: project.client || '',
          });
  
          // Встановлюємо їх одразу в projectInformation
          setProjectInformation((prev) => ({
            ...prev,
            project_name: project.project_name || '',
            client: project.client || '',
          }));
        })
        .catch(() => toast.error('❌ Failed to load project'));
  
      // 2. Пробуємо отримати останню інспекцію
      axiosInstance.get(`projects/${id}/inspections/latest`)
        .then((res) => {
          const data = res.data.data;
          if (data && data.pre_inspection && data.project_information) {
            setPreInspection(clean(data.pre_inspection));
            setProjectInformation((prev) => ({
              ...prev,
              ...clean(data.project_information)
            }));
          }
        })
        .catch(() => {
          // нічого не робимо — це може бути перша інспекція
        });
    }
  }, [id]);

  const handleCreateInspection = async () => {
    setIsSubmitting(true);
    const payload = {
      inspector_name: user?.name || 'Unknown777',
      project_name: projectInformation.project_name,
      client: projectInformation.client,
      inspection_date: projectInformation.inspection_date,
      pre_inspection: clean(preInspection),
      post_inspection: clean(postInspection),
      project_information: clean(projectInformation),
      site_inspections: siteInspections,
    };
    

    // console.log('📦 Creating inspection with payload:', payload);

    try {
      await axiosInstance.post(`projects/${id}/inspections`, payload);
      toast.success('Inspection created!');
      router.push(`/projects/${id}/inspections`);
    } catch (err) {
      const error = err as AxiosError<ValidationErrorResponse>;

      if (error.response?.data?.errors) {
        const messages = Object.values(error.response.data.errors).flat();
        toast.error(messages[0] || '❌ Validation error');
      } else {
        toast.error('❌ Failed to create inspection');
      }
    } finally {
      setIsSubmitting(false); // 🔚 Розблокувати кнопку
    }
  };

  return (
    <ProtectedLayout>
      <div className="p-4 bg-gray-100 min-h-screen flex flex-col gap-6">
        <h1 className="text-xl font-bold text-gray-800 text-center">FIRE STOPPING INSPECTION PROCEDURE</h1>
  
        <PreInspectionSection data={preInspection} onChange={setPreInspection} />
        <ProjectInformationSection data={projectInformation} onChange={setProjectInformation} />
        <SiteInspectionsSection data={siteInspections} onChange={setSiteInspections} />
        <PostInspectionSection data={postInspection} onChange={setPostInspection} />
  
        <div className='flex justify-between items-center mb-6'>
          <button
            onClick={() => setCancelAgree(true)}
            className="bg-gray-700 text-white py-2 px-4 rounded
              hover:bg-gray-800 hover:scale-105 active:scale-95 hover:shadow-lg transition duration-100
              fixed bottom-3 left-3"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={() => setSaveAgree(true)}
            className="bg-blue-600 text-white py-2 px-4 rounded
              hover:bg-blue-800 hover:scale-105 active:scale-95 hover:shadow-lg transition duration-100
              fixed bottom-3 right-3"
            disabled={isSubmitting}
          >
            Save Inspection
          </button>
        </div>
      </div>

      {cancelAgree && (
        <ModalConfirm
          title="Cancel Inspection"
          nameAction="Confirm"
          message="If you leave this page all changes will not be saved. Do you confirm the cancellation?"
          onConfirm={ () => router.push(`/projects/${id}/inspections`)}
          onCancel={() => setCancelAgree(false)}
        />
      )}
      {saveAgree && (
        <ModalConfirm
          title="Save Inspection"
          message="Are you sure you want to save the inspection?"
          nameAction="Save"
          confirmColor="blue"
          onConfirm={handleCreateInspection}
          onCancel={() => setSaveAgree(false)}
          loadingText="Saving..."
          isAsync // обов’язково!
        />
      )}
    </ProtectedLayout>
  );
}
