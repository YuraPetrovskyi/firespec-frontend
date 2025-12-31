"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

import SkeletonCard from "@/components/SkeletonCard";
import ModalConfirm from "@/components/ModalConfirm";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import InspectionActionsModal from "@/components/InspectionActionsModal";
import { loadInspectionFromLocal } from "@/lib/inspectionLocalStorage";
import { loadEditInspectionFromLocal } from "@/lib/inspectionLocalStorage";
import { exportInspectionToExcel } from "@/lib/exportInspectionToExcel";
import { exportReportToExcel } from "@/lib/exportReportToExcel";
import { useNetworkStatus } from "@/context/NetworkStatusContext";
import {
  saveInspectionsByProject,
  getInspectionsByProject,
} from "@/lib/indexedDb";

interface Inspection {
  id: number;
  inspection_number: string;
  version: number;
  inspection_date: string;
  inspector_name: string;
  details: {
    project_name: string;
  };
}

export default function ProjectInspectionsPage() {
  const { id } = useParams();
  const { isOnline } = useNetworkStatus();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [actionsModalOpen, setActionsModalOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] =
    useState<Inspection | null>(null);

  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    // Якщо offline - одразу завантажуємо з IndexedDB
    if (!isOnline) {
      getInspectionsByProject(id.toString())
        .then((cached) => {
          setInspections(cached);
          toast.success("📦 Loaded inspections from offline cache");
        })
        .catch((e) => {
          toast.error("❌ No cached data available offline.");
        })
        .finally(() => setLoading(false));

      // Перевірка чернетки
      const saved = loadInspectionFromLocal(id as string);
      const isValidDraft =
        saved && Object.keys(saved.projectInformation || {}).length > 1;
      setHasDraft(isValidDraft);
      return;
    }

    // Online - завантажуємо з API
    axios
      .get(`projects/${id}/inspections`)
      .then((res) => {
        setInspections(res.data.data);
        saveInspectionsByProject(id.toString(), res.data.data); // 💾 кешуємо
      })
      .catch(async (err) => {
        try {
          const cached = await getInspectionsByProject(id.toString());
          setInspections(cached);
          toast.success("📦 Loaded inspections from offline cache");
        } catch (e) {
          toast.error("❌ Cannot load inspections online or offline.");
        }
      })
      .finally(() => setLoading(false));

    // Перевірка чернетки нової інспекції
    const saved = loadInspectionFromLocal(id as string);
    const isValidDraft =
      saved && Object.keys(saved.projectInformation || {}).length > 1;
    setHasDraft(isValidDraft);
  }, [id, isOnline]);

  const handleDeleteInspection = async () => {
    if (!selectedInspection) return;

    if (!isOnline) {
      toast.error("❌ Cannot delete inspection while offline");
      setModalOpen(false);
      return;
    }

    try {
      await axios.delete(`projects/${id}/inspections/${selectedInspection.id}`);
      toast.success("Inspection deleted!");
      setInspections((prev) =>
        prev.filter((i) => i.id !== selectedInspection.id)
      );
    } catch (error) {
      toast.error("❌ Failed to delete inspection.");
    } finally {
      setModalOpen(false);
      setSelectedInspection(null);
    }
  };

  // console.log('inspections', inspections);

  return (
    <ProtectedLayout>
      <div className="p-4 pb-10 min-h-screen max-w-[1250px] mx-auto reletive">
        {hasDraft && (
          <div className="text-yellow-800 bg-yellow-100 border border-yellow-400 px-4 py-2 rounded mb-2">
            ⚠️ You have unsaved progress from your last visit.
          </div>
        )}
        <Link
          href={`/projects`}
          className="bg-gray-700 text-white py-2 px-6 rounded 
            hover:bg-gray-800 hover:scale-105 active:scale-95 transition-transform duration-200 fixed bottom-3 left-3"
        >
          Back
        </Link>

        <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 uppercase">
            Inspections
          </h1>
          <Link
            href={`/projects/${id}/inspections/create`}
            className="bg-blue-600 text-white font-bold px-4 py-2 rounded
            hover:bg-blue-700 hover:scale-105 active:scale-95 hover:shadow-lg transition duration-100"
          >
            {hasDraft ? "Continue Inspection" : "Create Inspection"}
          </Link>
        </div>

        <div className="flex flex-col gap-3 mb-6  mx-auto">
          {loading ? (
            Array.from({ length: 1 }).map((_, i) => <SkeletonCard key={i} />)
          ) : inspections.length > 0 ? (
            inspections.map((inspection) => {
              const localEdit = loadEditInspectionFromLocal(
                id as string,
                inspection.id.toString()
              );
              const hasUnsaved =
                localEdit &&
                Object.keys(localEdit.projectInformation || {}).length > 1;

              return (
                <div
                  key={inspection.id}
                  className="bg-white shadow-md rounded px-6 py-4 border border-gray-200
                      flex flex-col"
                >
                  <div className="flex flex-row flex-wrap justify-between items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold text-blue-800">
                      Inspection {inspection.inspection_number}
                    </h2>
                    <p className="text-xl font-bold">
                      Version {inspection.version}
                    </p>
                  </div>

                  {inspection.version > 1 && (
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-green-500 mb-2">
                        edited version ...
                      </p>
                      <Link
                        href={`/projects/${id}/inspections/${inspection.id}/logs`}
                        className="bg-green-500/60 text-white py-1 px-2 rounded
                          hover:bg-green-700 hover:scale-105 active:scale-95 hover:shadow-lg transition duration-100"
                      >
                        View Change Log
                      </Link>
                    </div>
                  )}

                  <div className="ml-2 mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Project name: {inspection.details?.project_name}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Inspection Date:{" "}
                      {new Date(
                        inspection.inspection_date
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Inspector: {inspection.inspector_name}
                    </p>
                  </div>

                  {hasUnsaved && (
                    <div className="text-yellow-800 bg-yellow-100 border border-yellow-400 px-3 py-1 rounded mb-2 text-sm text-center">
                      ⚠️ You have unsaved edits for this inspection.
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-auto">
                    <Link
                      href={`/projects/${id}/inspections/${inspection.id}`}
                      className="bg-gray-700 text-white py-1 px-3 rounded 
                          hover:bg-gray-800 hover:bg-blue-700 hover:scale-105 active:scale-95 hover:shadow-lg transition duration-100"
                    >
                      View
                    </Link>

                    {/* Actions Menu Button */}
                    <button
                      onClick={() => {
                        setSelectedInspection(inspection);
                        setActionsModalOpen(true);
                      }}
                      className="bg-gray-600 text-white py-1 px-3 rounded 
                        hover:bg-gray-700 hover:scale-105 active:scale-95 hover:shadow-lg transition duration-100
                        flex items-center gap-2"
                    >
                      {/* <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg> */}
                      Actions
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-600 mt-20">
              <p className="text-xl font-semibold">📭 No inspections yet</p>
              <p className="mt-2">Start by adding your first inspection.</p>
            </div>
          )}
        </div>

        {modalOpen && (
          <ModalConfirm
            message="Are you sure you want to delete this inspection?"
            nameAction="Delete"
            title="Delete Inspection"
            onConfirm={handleDeleteInspection}
            onCancel={() => {
              setModalOpen(false);
              setSelectedInspection(null);
            }}
          />
        )}

        {actionsModalOpen && selectedInspection && (
          <InspectionActionsModal
            isOpen={actionsModalOpen}
            onClose={() => {
              setActionsModalOpen(false);
              setSelectedInspection(null);
            }}
            onEdit={() => {
              window.location.href = `/projects/${id}/inspections/${selectedInspection.id}/edit`;
            }}
            onDelete={() => {
              setActionsModalOpen(false);
              // НЕ обнуляємо selectedInspection тут, бо він потрібен для видалення
              setModalOpen(true);
            }}
            onExportInspection={async () => {
              const projectId = Array.isArray(id) ? id[0] : id;
              if (!projectId) return;
              await exportInspectionToExcel(
                projectId,
                selectedInspection.id,
                selectedInspection.inspection_number
              );
            }}
            onGenerateReport={async () => {
              const projectId = Array.isArray(id) ? id[0] : id;
              if (!projectId) return;
              await exportReportToExcel(
                projectId,
                selectedInspection.id,
                selectedInspection.inspection_number
              );
            }}
            inspectionNumber={selectedInspection.inspection_number}
            version={selectedInspection.version}
          />
        )}
      </div>
    </ProtectedLayout>
  );
}
