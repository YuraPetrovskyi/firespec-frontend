import axios from '@/lib/axios';
import { saveProjects, saveInspectionsByProject, saveInspectionDetail } from './indexedDb';

export const syncOfflineData = async () => {
  const res = await axios.get('projects');
  const projects = res.data.data;
  await saveProjects(projects);

  for (const project of projects) {
    if (project.status !== 'in_progress') continue;

    const projectId = project.id;
    const insRes = await axios.get(`projects/${projectId}/inspections`);
    const inspections = insRes.data.data;
    await saveInspectionsByProject(projectId.toString(), inspections);

    for (const inspection of inspections) {
      const detRes = await axios.get(`projects/${projectId}/inspections/${inspection.id}`);
      const fullInspection = detRes.data.data;
      await saveInspectionDetail(fullInspection);
    }
  }
};
