const STORAGE_KEY = "new-inspection";
const EDIT_STORAGE_KEY = "edit-inspection";

export const saveInspectionToLocal = (projectId: string, data: any) => {
  localStorage.setItem(`${STORAGE_KEY}-${projectId}`, JSON.stringify(data));
  // console.log(`Inspection data saved for project ${projectId}`);
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


export const saveEditInspectionToLocal = (projectId: string, inspectionId: string, data: any) => {
  localStorage.setItem(`${EDIT_STORAGE_KEY}-${projectId}-${inspectionId}`, JSON.stringify(data));
  // console.log(`saveEditInspectionToLocal for project ${projectId} and inspection ${inspectionId}`);
  // console.log('saveEditInspectionToLocal data:', JSON.stringify(data));

};

export const loadEditInspectionFromLocal = (projectId: string, inspectionId: string) => {
  const raw = localStorage.getItem(`${EDIT_STORAGE_KEY}-${projectId}-${inspectionId}`);
  // console.log(`loadEditInspectionFromLocal from project ${projectId}`);
  return raw ? JSON.parse(raw) : null;
};

export const clearEditInspectionLocal = (projectId: string, inspectionId: string) => {
  localStorage.removeItem(`${EDIT_STORAGE_KEY}-${projectId}-${inspectionId}`);
  // console.log(`clearEditInspectionLocal from project ${projectId}`);
};
