import { openDB } from "idb";

const DB_NAME = "firespec-db";
const DB_VERSION = 2; // Incremented for new offline-queue store

export const initDb = async () => {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("projects")) {
        db.createObjectStore("projects", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("inspections")) {
        // Unique key: projectId-inspectionId - _id
        db.createObjectStore("inspections", { keyPath: "_id" });
      }
      if (!db.objectStoreNames.contains("inspection-details")) {
        db.createObjectStore("inspection-details", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("offline-queue")) {
        // Auto-incrementing key for queue items
        db.createObjectStore("offline-queue", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
};

// 🔹 PROJECTS
export const saveProjects = async (projects: any[]) => {
  const db = await initDb();
  const tx = db.transaction("projects", "readwrite");
  const store = tx.objectStore("projects");

  projects.forEach((project) => {
    store.put(project);
  });

  await tx.done;
};

export const getProjects = async (): Promise<any[]> => {
  const db = await initDb();
  return await db.getAll("projects");
};

export const getProjectById = async (
  projectId: number
): Promise<any | undefined> => {
  const db = await initDb();
  return await db.get("projects", projectId);
};

// 🔹 INSPECTIONS by project
export const saveInspectionsByProject = async (
  projectId: string,
  inspections: any[]
) => {
  const db = await initDb();

  // 🧹 Спочатку отримуємо список інспекцій для видалення
  const allInspections = await db.getAll("inspections");
  const toDelete = allInspections.filter(
    (i) => i.project_id === Number(projectId)
  );

  // Створюємо транзакцію ПІСЛЯ отримання даних
  const tx = db.transaction("inspections", "readwrite");
  const store = tx.objectStore("inspections");

  // Видаляємо без await (синхронно всередині транзакції)
  for (const item of toDelete) {
    store.delete(item._id);
  }

  // 💾 Зберігаємо нові інспекції (також синхронно)
  inspections.forEach((inspection) => {
    const record = {
      ...inspection,
      _id: `${projectId}-${inspection.id}`, // 🧠 унікальний ключ
    };
    store.put(record);
  });

  // Чекаємо завершення транзакції
  await tx.done;
};

export const getInspectionsByProject = async (
  projectId: string
): Promise<any[]> => {
  const db = await initDb();
  const all = await db.getAll("inspections");
  return all.filter((i) => i.project_id === Number(projectId));
};

// 🔹 INSPECTION DETAILS (single inspection full object)
export const saveInspectionDetail = async (inspection: any) => {
  const db = await initDb();
  await db.put("inspection-details", inspection);
};

export const getInspectionDetail = async (
  id: number
): Promise<any | undefined> => {
  const db = await initDb();
  return await db.get("inspection-details", id);
};
