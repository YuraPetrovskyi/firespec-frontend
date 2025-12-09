import axios from "@/lib/axios";
import toast from "react-hot-toast";

export async function exportInspectionToExcel(
  projectId: string | number,
  inspectionId: string | number,
  inspectionNumber: string,
  onComplete?: () => void
) {
  try {
    const response = await axios.get(
      `projects/${projectId}/inspections/${inspectionId}/export`,
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `inspection_${inspectionNumber}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Inspection exported successfully!");
  } catch (error) {
    console.error("❌ Export failed", error);
    toast.error("Failed to export Excel file");
  } finally {
    onComplete?.();
  }
}
