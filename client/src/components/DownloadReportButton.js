import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import HealthReportPDF from './HealthReportPDF';

/**
 * A simple button component to trigger a PDF report download for a specific health data ID.
 * This component is intentionally basic, without MUI styling, to allow for flexible use.
 * It accepts a healthDataId and an onError callback.
 *
 * @param {object} props
 * @param {number|string} props.healthDataId - The ID of the health data to fetch for the report.
 * @param {function} props.onError - Callback function to handle errors.
 */
const DownloadReportButton = ({ healthDataId, onError }) => {

  const handleDownload = async () => {
    if (!healthDataId) {
      if (onError) onError("Health Data ID is required.");
      return;
    }

    try {
      // 1. Fetch data from the backend
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/reports/specific/${healthDataId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `Error: ${response.status}` }));
        throw new Error(errorData.detail);
      }
      
      const reportData = await response.json();

      // 2. Generate PDF blob
      const blob = await pdf(<HealthReportPDF data={reportData} />).toBlob();

      // 3. Trigger download
      saveAs(blob, `HealthReport_${reportData.userAccount.FullName.replace(/\s/g, '_')}_${reportData.healthData.HealthDataID}.pdf`);
      if (onError) onError(null); // Clear previous errors on success

    } catch (error) {
      console.error("Failed to download report:", error);
      if (onError) onError(error.message);
    }
  };

  return (
    <button onClick={handleDownload}>
      Download Report
    </button>
  );
};

export default DownloadReportButton;
