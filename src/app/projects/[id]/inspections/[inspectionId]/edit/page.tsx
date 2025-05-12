'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

import PreInspectionSection from '@/components/inspection/PreInspectionSection';
import ProjectInformationSection from '@/components/inspection/ProjectInformationSection';
import SiteInspectionsSection from '@/components/inspection/SiteInspectionsSection';
import PostInspectionSection from '@/components/inspection/PostInspectionSection';

import ProtectedLayout from "@/components/layouts/ProtectedLayout";

import { useAuth } from "@/context/AuthContext";


type SectionData = { [key: string]: any };

type InspectionData = {
  inspection_number: number;
  pre_inspection: SectionData;
  post_inspection: SectionData;
  project_information: SectionData;
  site_inspections: SectionData;
};

// Додаємо мапи лейблів:
const PRE_INSPECTION_LABELS: Record<string, string> = {
  rams_info_submitted: 'RAMS information submitted',
  induction_arranged: 'Induction arranged',
  induction_attended: 'Induction attended',
  ppe_checked: 'PPE (incl glasses and sleeves for Wates)',
  client_meeting: 'Meet with client representative',
  fire_drawings_available: 'Latest fire strategy drawings available',
  bolster_uploads: 'Bolster uploads completed',
  bolster_synced: 'Bolster down synced and checked',
  latest_eta_available: 'Latest Manufacturer ETAs',
  walkthrough_done: 'Walk through and cursory inspection',
};

const PROJECT_INFO_LABELS: Record<string, string> = {
  project_name: 'Project Name',
  inspection_date: 'Inspection Date',
  client: 'Client',
  client_contact: 'Client Contact & Title',
  client_rep: 'Client Site Rep & Title',
  installer: 'Installer/contractor',
  third_party_acr: '3rd Party Acr. Body',
  storeys: 'Storeys',
  structural_frame: 'Structural Frame',
  façade: 'Façade',
  floor_type: 'Floor Type',
  internal_walls: 'Internal Walls Types',
  fire_stopping_materials: 'Fire Stopping Materials',
  barrier_materials: 'Barrier Materials',
  dampers: 'Dampers',
  encasements: 'Encasements',
  digital_recording: 'Digital Recording',
};

const POST_INSPECTION_LABELS: Record<string, string> = {
  next_inspection_date: 'Date of next inspection visit',
  client_meeting_done: 'Meet with client representative',
  urgent_matters: 'Communicate urgent matters',
  bolster_notes: 'Up-sync Bolster',
  comment: 'Comment',
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

  const { user } = useAuth();

  const clean = (obj: any) => {
    if (!obj || typeof obj !== 'object') return {};
    const { id, created_at, updated_at, inspection_id, ...rest } = obj;
    return rest;
  };

  useEffect(() => {
    if (id && inspectionId) {
      axios
        .get(`projects/${id}/inspections/${inspectionId}`)
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
          setOldSiteInspections(JSON.parse(JSON.stringify(data.site_inspections || {}))); //глибоке копіювання (deep clone) об'єкта щоб уникнути проблем з порівнянням сторго і нового обєкту
          
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
      label?: string;
      from: any;
      to: any;
    }[] = [];
  
    const compare = (category: string, field: string, oldVal: any, newVal: any, label?: string) => {
      if (String(oldVal ?? '') !== String(newVal ?? '')) {
        changes.push({
          category,
          field,
          from: oldVal,
          to: newVal,
          label,
        });
      }
    };
  
    // Project Info
    Object.entries(newData.projectInformation).forEach(([key, val]) => {
      compare('Project Information', key, oldData.projectInformation?.[key], val, PROJECT_INFO_LABELS[key]);
    });
  
    // Pre-inspection
    Object.entries(newData.preInspection).forEach(([key, val]) => {
      compare('Pre-Inspection', key, oldData.preInspection?.[key], val, PRE_INSPECTION_LABELS[key]);
    });
  
    // Post-inspection
    Object.entries(newData.postInspection).forEach(([key, val]) => {
      compare('Post-Inspection', key, oldData.postInspection?.[key], val, POST_INSPECTION_LABELS[key]);
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
      inspector_name: user?.name || 'Unknown',
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
      await axios.put(`projects/${id}/inspections/${inspectionId}`, payload);
      toast.success('Inspection updated!');
      router.push(`/projects/${id}/inspections`);
    } catch (err: any) {
      console.error(err);
      toast.error('❌ Failed to update inspection.');
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <p className='text-xl text-center p-10'>Loading...</p>
      </ProtectedLayout>);
  }

  // console.log('projectInformation:', projectInformation);
  return (
    <ProtectedLayout>
      <div className="p-5 bg-gray-100 min-h-screen flex flex-col gap-6 pb-20">
        <h1 className="text-3xl text-center font-bold text-gray-800">Edit Inspection</h1>
  
        <PreInspectionSection data={preInspection} onChange={setPreInspection} />
        <ProjectInformationSection data={projectInformation} onChange={setProjectInformation} />
        <SiteInspectionsSection data={siteInspections} onChange={setSiteInspections} />
        <PostInspectionSection data={postInspection} onChange={setPostInspection} />

        <button
            onClick={() => router.push(`/projects/${id}/inspections/${inspectionId}`)}
            className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800 fixed bottom-5 left-3"
          >
            Cansel
        </button>
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white py-2 px-2 rounded hover:bg-blue-80  fixed bottom-5 right-3"
          >
            Save Changes
        </button>
        
      </div>
    </ProtectedLayout>
  );
}
