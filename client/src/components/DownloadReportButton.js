import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import HealthReportPDFFlat from './HealthReportPDFFlat';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

/**
 * A simple button component to trigger a PDF report download for a specific health data ID.
 * This component is intentionally basic, without MUI styling, to allow for flexible use.
 * It accepts a healthDataId and an onError callback.
 * Optionally, you can pass `flatReportData` and `meta` (from /getReportData and selected date)
 * to generate the PDF without refetching.
 *
 * @param {object} props
 * @param {number|string} props.healthDataId - The ID of the health data to fetch for the report.
 * @param {object} [props.flatReportData] - Already-fetched flat report data from /getReportData/{id}.
 * @param {object} [props.meta] - Additional metadata: { date, healthDataID, fileNameHint }.
 * @param {function} props.onError - Callback function to handle errors.
 */
const DownloadReportButton = ({ healthDataId, flatReportData, meta, onError }) => {

  const handleDownload = async () => {
    if (!flatReportData && !healthDataId) {
      onError?.("Health Data ID is required.");
      return;
    }

    try {
      // Build local date string for filename to avoid timezone shift
      const buildLocalDatePart = (value) => {
        if (!value) return 'report';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return 'report';
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };

      // Generate from flat data (page already has it)
      const fileName = meta?.fileNameHint
        || `HealthReport_${String(meta?.healthDataID ?? healthDataId)}_${buildLocalDatePart(meta?.date)}.pdf`;
      const blob = await pdf(
        <HealthReportPDFFlat data={flatReportData} metaId={meta?.healthDataID ?? healthDataId} metaDate={meta?.date} />
      ).toBlob();
      saveAs(blob, fileName);
      if (onError) onError?.(null); // Clear previous errors on success

    } catch (error) {
      console.error("Failed to download report:", error);
      if (onError) onError(error.message);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleDownload} startIcon={<DownloadIcon />}> 
      Download Report
    </Button>
  );
};

export default DownloadReportButton;
