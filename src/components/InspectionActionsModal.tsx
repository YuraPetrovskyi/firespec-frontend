"use client";

import { useState, useEffect } from "react";

interface InspectionActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onExportInspection: () => void;
  onGenerateReport: () => void;
  inspectionNumber: string;
  version: number;
}

export default function InspectionActionsModal({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onExportInspection,
  onGenerateReport,
  inspectionNumber,
  version,
}: InspectionActionsModalProps) {
  const [isExportingInspection, setIsExportingInspection] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsClosing(false);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!isOpen) return null;

  const handleExportInspection = async () => {
    setIsExportingInspection(true);
    await onExportInspection();
    setIsExportingInspection(false);
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    await onGenerateReport();
    setIsGeneratingReport(false);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm transition-all duration-200 ${
        isClosing ? "bg-opacity-0" : "bg-opacity-50"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl p-6 w-11/12 max-w-md mx-4 transition-all duration-200 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            Inspection Actions
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Inspection {inspectionNumber} (Version {version})
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Edit Button */}
          <button
            onClick={() => {
              onEdit();
              // Не використовуємо handleClose тут, щоб не було затримки
              onClose();
            }}
            className="w-full bg-yellow-500 text-white font-semibold py-3 px-4 rounded-lg
              hover:bg-yellow-600 hover:scale-105 active:scale-95 transition-transform duration-200
              flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Inspection
          </button>

          {/* Export to Excel Button */}
          <button
            onClick={handleExportInspection}
            disabled={isExportingInspection}
            className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg
              hover:bg-green-700 hover:scale-105 active:scale-95 transition-transform duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              flex items-center justify-center gap-2"
          >
            {isExportingInspection ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export to Excel
              </>
            )}
          </button>

          {/* Generate Report Button */}
          <button
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg
              hover:bg-blue-700 hover:scale-105 active:scale-95 transition-transform duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              flex items-center justify-center gap-2"
          >
            {isGeneratingReport ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Generate Report
              </>
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className="w-full bg-red-600 text-white font-semibold py-3 px-4 rounded-lg
              hover:bg-red-700 hover:scale-105 active:scale-95 transition-transform duration-200
              flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Inspection
          </button>

          {/* Cancel Button */}
          <button
            onClick={handleClose}
            className="w-full bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg
              hover:bg-gray-400 hover:scale-105 active:scale-95 transition-transform duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
