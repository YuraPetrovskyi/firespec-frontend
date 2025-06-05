import { openDB } from 'idb';

const DB_NAME = 'firespec-db';
const DB_VERSION = 1;

export const initDb = async () => {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('projects')) {
        db.createObjectStore('projects', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('inspections')) {
        // 🧠 Унікальний ключ — projectId-inspectionId - _id
        db.createObjectStore('inspections', { keyPath: '_id' });
      }
      if (!db.objectStoreNames.contains('inspection-details')) {
        db.createObjectStore('inspection-details', { keyPath: 'id' });
      }
    },
  });
};

// 🔹 PROJECTS
export const saveProjects = async (projects: any[]) => {
  const db = await initDb();
  const tx = db.transaction('projects', 'readwrite');
  const store = tx.objectStore('projects');

  projects.forEach((project) => {
    store.put(project);
  });

  await tx.done;
};

export const getProjects = async (): Promise<any[]> => {
  const db = await initDb();
  return await db.getAll('projects');
};

// 🔹 INSPECTIONS by project
export const saveInspectionsByProject = async (projectId: string, inspections: any[]) => {
  const db = await initDb();
  const tx = db.transaction('inspections', 'readwrite');
  const store = tx.objectStore('inspections');

  inspections.forEach((inspection) => {
    const record = {
      ...inspection,
      _id: `${projectId}-${inspection.id}` // 🧠 унікальний ключ
    };
    store.put(record); // буде збережено за _id
  });

  await tx.done;
};

export const getInspectionsByProject = async (projectId: string): Promise<any[]> => {
  const db = await initDb();
  const all = await db.getAll('inspections');
  return all.filter((i) => i.project_id === Number(projectId));
};

// 🔹 INSPECTION DETAILS (single inspection full object)
export const saveInspectionDetail = async (inspection: any) => {
  const db = await initDb();
  await db.put('inspection-details', inspection);
};

export const getInspectionDetail = async (id: number): Promise<any | undefined> => {
  const db = await initDb();
  return await db.get('inspection-details', id);
};