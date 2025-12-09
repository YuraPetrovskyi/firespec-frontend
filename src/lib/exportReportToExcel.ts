import axios from "@/lib/axios";
import toast from "react-hot-toast";

export async function exportReportToExcel(
  projectId: string | number,
  inspectionId: string | number,
  inspectionNumber: string,
  onComplete?: () => void
) {
  try {
    const response = await axios.get(
      `projects/${projectId}/inspections/${inspectionId}/export-report`,
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `report_${inspectionNumber}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Report exported successfully!");
  } catch (error) {
    console.error("❌ Report export failed", error);
    toast.error("Failed to export report");
  } finally {
    onComplete?.();
  }
}
