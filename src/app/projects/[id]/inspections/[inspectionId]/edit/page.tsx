'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

import PreInspectionSection from '@/components/inspection/PreInspectionSection';
import ProjectInformationSection from '@/components/inspection/ProjectInformationSection';
import SiteInspectionsSection from '@/components/inspection/SiteInspectionsSection';
import PostInspectionSection from '@/components/inspection/PostInspectionSection';

type SectionData = { [key: string]: any };

type InspectionData = {
  inspection_number: number;
  pre_inspection: SectionData;
  post_inspection: SectionData;
  project_information: SectionData;
  site_inspections: SectionData;
};

export default function EditInspectionPage() {
  const { id, inspectionId } = useParams();
  const router = useRouter();

  const [oldPreInspection, setOldPreInspection] = useState<SectionData>({});
  const [oldProjectInformation, setOldProjectInformation] = useState<SectionData>({});
  const [oldSiteInspections, setOldSiteInspections] = useState<SectionData>({});
  const [oldPostInspection, setOldPostInspection] = useState<SectionData>({});
  
  const [preInspection, setPreInspection] = useState<SectionData>({});
  const [projectInformation, setProjectInformation] = useState<SectionData>({});
  const [siteInspections, setSiteInspections] = useState<SectionData>({});
  const [postInspection, setPostInspection] = useState<SectionData>({});
  const [loading, setLoading] = useState(true);

  const clean = (obj: any) => {
    if (!obj || typeof obj !== 'object') return {};
    const { id, created_at, updated_at, inspection_id, ...rest } = obj;
    return rest;
  };

  useEffect(() => {
    if (id && inspectionId) {
      axios
        .get(`http://127.0.0.1:8000/api/projects/${id}/inspections/${inspectionId}`)
        .then((res) => {
          const data: InspectionData = res.data.data;

          setPreInspection(clean(data.pre_inspection));
          setOldPreInspection(clean(data.pre_inspection));
          setPostInspection(clean(data.post_inspection));
          setOldPostInspection(clean(data.post_inspection));

          const cleanedProjectInfo = {
            ...clean(data.project_information),
            project_name: data.project_information?.project_name || '',
            client: data.project_information?.client || '',
            inspection_date: data.project_information?.inspection_date || '',
            inspector_name: data.project_information?.inspector_name || '',
          };
          setProjectInformation(cleanedProjectInfo);
          setOldProjectInformation(cleanedProjectInfo);
          setSiteInspections(data.site_inspections || {});
          setOldSiteInspections(data.site_inspections || {});
          
          console.log('Edit Inspection data:', data);
        })
        .catch(() => toast.error('❌ Failed to load inspection'))
        .finally(() => setLoading(false));
    }
  }, [id, inspectionId]);

  const generateChangeLog = (
    oldData: {
      preInspection: SectionData;
      postInspection: SectionData;
      projectInformation: SectionData;
      siteInspections: SectionData;
    },
    newData: {
      preInspection: SectionData;
      postInspection: SectionData;
      projectInformation: SectionData;
      siteInspections: SectionData;
    }
  ) => {
    const changes: {
      category: string;
      subcategory?: string;
      field: string;
      from: any;
      to: any;
    }[] = [];
  
    const compare = (category: string, field: string, oldVal: any, newVal: any) => {
      if (String(oldVal ?? '') !== String(newVal ?? '')) {
        changes.push({
          category,
          field,
          from: oldVal,
          to: newVal,
        });
      }
    };
  
    // Project Info
    Object.entries(newData.projectInformation).forEach(([key, val]) => {
      compare('Project Information', key, oldData.projectInformation?.[key], val);
    });
  
    // Pre-inspection
    Object.entries(newData.preInspection).forEach(([key, val]) => {
      compare('Pre-Inspection', key, oldData.preInspection?.[key], val);
    });
  
    // Post-inspection
    Object.entries(newData.postInspection).forEach(([key, val]) => {
      compare('Post-Inspection', key, oldData.postInspection?.[key], val);
    });
  
    // 🔹 Site Inspections
    Object.entries(newData.siteInspections).forEach(([category, values]) => {
      Object.entries(values).forEach(([field, val]) => {
        const oldVal = oldData.siteInspections?.[category]?.[field];
        if (String(oldVal ?? '') !== String(val ?? '')) {
          changes.push({
            category: `Site Inspections`,
            subcategory: category,
            field,
            from: oldVal,
            to: val,
          });
        }
      });
    });
  
    return changes;
  };
  

  const handleUpdate = async () => {
    const payload = {
      project_name: projectInformation.project_name,
      client: projectInformation.client,
      inspection_date: projectInformation.inspection_date,
      inspector_name: projectInformation.inspector_name || 'Unknown',
      pre_inspection: clean(preInspection),
      post_inspection: clean(postInspection),
      project_information: clean(projectInformation),
      site_inspections: siteInspections,
      log_changes: generateChangeLog(
        {
          preInspection: oldPreInspection,
          postInspection: oldPostInspection,
          projectInformation: oldProjectInformation,
          siteInspections: oldSiteInspections,
        },
        {
          preInspection,
          postInspection,
          projectInformation,
          siteInspections,
        }
      ),
    };

    console.log('Update Inspection payload:', payload);

    try {
      await axios.put(`http://127.0.0.1:8000/api/projects/${id}/inspections/${inspectionId}`, payload);
      toast.success('✅ Inspection updated!');
      router.push(`/projects/${id}/inspections`);
    } catch (err: any) {
      console.error(err);
      toast.error('❌ Failed to update inspection.');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  // console.log('projectInformation:', projectInformation);
  return (
    <div className="p-10 bg-gray-100 min-h-screen flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-800">✏️ Edit Inspection</h1>

      <PreInspectionSection data={preInspection} onChange={setPreInspection} />
      <ProjectInformationSection data={projectInformation} onChange={setProjectInformation} />
      <SiteInspectionsSection data={siteInspections} onChange={setSiteInspections} />
      <PostInspectionSection data={postInspection} onChange={setPostInspection} />
      <div className='flex flex-row justify-between items-center'>
        <button
              onClick={() => router.push(`/projects/${id}/inspections/${inspectionId}`)}
              className="bg-gray-700 text-white py-2 px-6 rounded hover:bg-gray-800"
          >
            Cansel
        </button>
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 p-2"
          >
          💾 Save Changes
        </button>
      </div>
      
    </div>
  );
}
