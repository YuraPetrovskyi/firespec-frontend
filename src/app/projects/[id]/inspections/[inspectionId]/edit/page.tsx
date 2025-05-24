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
import ModalConfirm from '@/components/ModalConfirm';
import { useAuth } from "@/context/AuthContext";

import { inspectionSchema } from '@/config/inspectionSchema';

type SectionData = { [key: string]: any };

type InspectionData = {
  inspection_number: number;
  pre_inspection: SectionData;
  post_inspection: SectionData;
  project_information: SectionData;
  site_inspections: SectionData;
};

// Додаємо мапи лейблів:
// const PRE_INSPECTION_LABELS: Record<string, string> = {
//   rams_info_submitted: 'RAMS information submitted',
//   induction_arranged: 'Induction arranged',
//   induction_attended: 'Induction attended',
//   ppe_checked: 'PPE (incl glasses and sleeves for Wates)',
//   client_meeting: 'Meet with client representative',
//   fire_drawings_available: 'Latest fire strategy drawings available',
//   bolster_uploads: 'Bolster uploads completed',
//   bolster_synced: 'Bolster down synced and checked',
//   latest_eta_available: 'Latest Manufacturer ETAs',
//   walkthrough_done: 'Walk through and cursory inspection',
// };

// const PROJECT_INFO_LABELS: Record<string, string> = {
//   project_name: 'Project Name',
//   inspection_date: 'Inspection Date',
//   client: 'Client',
//   client_contact: 'Client Contact & Title',
//   client_rep: 'Client Site Rep & Title',
//   installer: 'Installer/contractor',
//   third_party_acr: '3rd Party Acr. Body',
//   storeys: 'Storeys',
//   structural_frame: 'Structural Frame',
//   façade: 'Façade',
//   floor_type: 'Floor Type',
//   internal_walls: 'Internal Walls Types',
//   fire_stopping_materials: 'Fire Stopping Materials',
//   barrier_materials: 'Barrier Materials',
//   dampers: 'Dampers',
//   encasements: 'Encasements',
//   digital_recording: 'Digital Recording',
// };

// const POST_INSPECTION_LABELS: Record<string, string> = {
//   next_inspection_date: 'Date of next inspection visit',
//   client_meeting_done: 'Meet with client representative',
//   urgent_matters: 'Communicate urgent matters',
//   bolster_notes: 'Up-sync Bolster',
//   comment: 'Comment',
// };


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
  const [cancelAgree, setCancelAgree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveAgree, setSaveAgree] = useState(false);

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

          // 🟩 Виправлена логіка ініціалізації siteInspections
          const fullSiteInspections = { ...data.site_inspections };
          inspectionSchema.siteInspections.forEach((cat) => {
            if (!fullSiteInspections[cat.name]) {
              fullSiteInspections[cat.name] = { main: 'not_checked' };
              cat.options.forEach((opt) => {
                fullSiteInspections[cat.name][opt.name] = 'not_selected';
              });
            }
          });

          setSiteInspections(fullSiteInspections);

          // 🔄 Інше як було:
          setPreInspection(data.pre_inspection);
          setPostInspection(data.post_inspection);

          const cleanedProjectInfo = {
            ...data.project_information,
            project_name: data.project_information?.project_name || '',
            client: data.project_information?.client || '',
            inspection_date: data.project_information?.inspection_date || '',
          };
          setProjectInformation(cleanedProjectInfo);

          setOldPreInspection(data.pre_inspection);
          setOldPostInspection(data.post_inspection);
          setOldProjectInformation(cleanedProjectInfo);
          setOldSiteInspections(JSON.parse(JSON.stringify(fullSiteInspections)));
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
    // Object.entries(newData.projectInformation).forEach(([key, val]) => {
    //   compare('Project Information', key, oldData.projectInformation?.[key], val, PROJECT_INFO_LABELS[key]);
    // });
    inspectionSchema.projectInformation.forEach(({ name, label }) => {
      const oldVal = oldData.projectInformation?.[name];
      const newVal = newData.projectInformation?.[name];
      compare('Project Information', name, oldVal, newVal, label);
    });

  
    // Pre-inspection
    // Object.entries(newData.preInspection).forEach(([key, val]) => {
    //   compare('Pre-Inspection', key, oldData.preInspection?.[key], val, PRE_INSPECTION_LABELS[key]);
    // });
    inspectionSchema.preInspection.forEach(({ name, label }) => {
      const oldVal = oldData.preInspection?.[name];
      const newVal = newData.preInspection?.[name];
      compare('Pre-Inspection', name, oldVal, newVal, label);
    });



    // Post-inspection
    // Object.entries(newData.postInspection).forEach(([key, val]) => {
    //   compare('Post-Inspection', key, oldData.postInspection?.[key], val, POST_INSPECTION_LABELS[key]);
    // });
    inspectionSchema.postInspection.forEach(({ name, label }) => {
      compare('Post-Inspection', name, oldData.postInspection?.[name], newData.postInspection?.[name], label);
    });
  
    // 🔹 Site Inspections
    // Object.entries(newData.siteInspections).forEach(([category, values]) => {
    //   Object.entries(values).forEach(([field, val]) => {
    //     const oldVal = oldData.siteInspections?.[category]?.[field];
    //     if (String(oldVal ?? '') !== String(val ?? '')) {
    //       changes.push({
    //         category: `Site Inspections`,
    //         subcategory: category,
    //         field,
    //         from: oldVal,
    //         to: val,
    //       });
    //     }
    //   });
    // });
    Object.entries(newData.siteInspections).forEach(([category, values]) => {
      Object.entries(values).forEach(([field, val]) => {
        const oldVal = oldData.siteInspections?.[category]?.[field];

        if (String(oldVal ?? '') !== String(val ?? '')) {
          const categorySchema = inspectionSchema.siteInspections.find((c) => c.name === category);
          const categoryLabel = categorySchema?.label || category;
          const optionLabel = categorySchema?.options.find((o) => o.name === field)?.label || field;

          changes.push({
            category: 'Site Inspections',
            subcategory: categoryLabel,
            field,
            label: optionLabel,
            from: oldVal,
            to: val,
          });
        }
      });
    });
  
    return changes;
  };
  

  const handleUpdate = async () => {
    setIsSubmitting(true);
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

    // console.log('Update Inspection payload:', payload);

    try {
      await axios.put(`projects/${id}/inspections/${inspectionId}`, payload);
      toast.success('Inspection updated!');
      router.push(`/projects/${id}/inspections`);
    } catch (err: any) {
      console.error(err);
      toast.error('❌ Failed to update inspection.');
    } finally {
      setIsSubmitting(false); // 🔚 Розблокувати кнопку
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
            onClick={() => setCancelAgree(true)}
            className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800 fixed bottom-3 left-3"
            disabled={isSubmitting}
          >
            Cancel
        </button>
        <button
          onClick={() => setSaveAgree(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800 transition fixed bottom-3 right-3"
          disabled={isSubmitting}
        >
          Save Changes
        </button>
        
      </div>
      
      {cancelAgree && (
        <ModalConfirm
          message="If you leave this page all changes will not be saved. Do you confirm the cancellation?"
          onConfirm={ () => router.push(`/projects/${id}/inspections/${inspectionId}`)}
          onCancel={() => setCancelAgree(false)}
          title="Cancel Inspection"
          nameAction="Confirm"
        />
      )}
      {saveAgree && (
        <ModalConfirm
          title="Save Changes"
          message="Are you sure you want to save changes?"
          nameAction="Save"
          confirmColor="blue"
          onConfirm={handleUpdate}
          onCancel={() => setSaveAgree(false)}
          loadingText="Saving..."
          isAsync // обов’язково!
        />
      )}
    </ProtectedLayout>
  );
}
