'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import axios from 'axios';
import toast from 'react-hot-toast';

import PreInspectionSection from '@/components/inspection/PreInspectionSection';
import ProjectInformationSection from '@/components/inspection/ProjectInformationSection';
import SiteInspectionsSection from '@/components/inspection/SiteInspectionsSection';
import PostInspectionSection from '@/components/inspection/PostInspectionSection';
import ProtectedLayout from "@/components/layouts/ProtectedLayout";

type ProjectData = {
  project_name: string;
  client: string;
};

type SectionData = {
  [key: string]: any;
};

export default function CreateInspectionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [preInspection, setPreInspection] = useState<SectionData>({});
  const [projectInformation, setProjectInformation] = useState<SectionData>({});
  const [siteInspections, setSiteInspections] = useState<SectionData>({});
  const [postInspection, setPostInspection] = useState<SectionData>({});
  const [projectData, setProjectData] = useState<ProjectData>({ project_name: '', client: '' });

  // утиліта для очищення службових полів
  const clean = (obj: any) => {
    if (!obj || typeof obj !== 'object') return {};
    const { id, created_at, updated_at, inspection_id, ...rest } = obj;
    return rest;
  };

  useEffect(() => {
    if (id) {
      // 1. Отримуємо дані про проєкт
      axios.get(`http://127.0.0.1:8000/api/projects/${id}`)
        .then((res) => {
          const project = res.data.data;
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
      axios.get(`http://127.0.0.1:8000/api/projects/${id}/inspections/latest`)
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
    const payload = {
      inspector_name: 'test_inspector',
      project_name: projectInformation.project_name,
      client: projectInformation.client,
      inspection_date: projectInformation.inspection_date,
      pre_inspection: clean(preInspection),
      post_inspection: clean(postInspection),
      project_information: clean(projectInformation),
      site_inspections: siteInspections,
    };
    

    console.log('📦 Creating inspection with payload:', payload);

    try {
      await axios.post(`http://127.0.0.1:8000/api/projects/${id}/inspections`, payload);
      toast.success('Inspection created!');
      router.push(`/projects/${id}/inspections`);
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors).flat() as string[];
        toast.error(messages[0] || '❌ Validation error.');
      } else {
        toast.error('❌ Failed to create inspection.');
      }
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
          <Link
            href={`/projects/${id}/inspections`}
            className="bg-gray-700 text-white py-2 px-6 rounded hover:bg-gray-800 transition"
          >
            Cancel
          </Link>
          <button
            onClick={handleCreateInspection}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Save Inspection
          </button>
        </div>
        
      </div>
    </ProtectedLayout>
  );
}
