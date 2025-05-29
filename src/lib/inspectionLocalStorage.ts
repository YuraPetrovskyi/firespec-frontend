const STORAGE_KEY = "new-inspection";

export const saveInspectionToLocal = (projectId: string, data: any) => {
  localStorage.setItem(`${STORAGE_KEY}-${projectId}`, JSON.stringify(data));
  // console.log(`Inspection data saved for project ${projectId}`);
  // console.log(`Inspection data saved for project ${JSON.parse(data)}`);
  // console.log(`Inspection data saved for project ${JSON.stringify(data)}`);

};

export const loadInspectionFromLocal = (projectId: string) => {
  const raw = localStorage.getItem(`${STORAGE_KEY}-${projectId}`);
  // console.log(`Inspection data load from project ${projectId}`);
  return raw ? JSON.parse(raw) : null;
};

export const clearInspectionLocal = (projectId: string) => {
  localStorage.removeItem(`${STORAGE_KEY}-${projectId}`);
  // console.log(`Inspection data removed from project ${projectId}`);
};
