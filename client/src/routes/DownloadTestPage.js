import React, { useState } from 'react';
import DownloadReportButton from '../components/DownloadReportButton';

const DownloadTestPage = () => {
  const [reportId, setReportId] = useState('111');
  const [error, setError] = useState(null);

  const handleIdChange = (event) => {
    setReportId(event.target.value);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Report Download Test</h1>
      
      <hr />

      <p>Enter a report ID below and click the button to download.</p>
      
      <div style={{ margin: '10px 0' }}>
        <label htmlFor="reportIdInput">Report ID: </label>
        <input
          id="reportIdInput"
          type="text"
          value={reportId}
          onChange={handleIdChange}
          style={{ marginRight: '10px' }}
        />
        <DownloadReportButton
          healthDataId={reportId}
          onError={handleError}
        />
      </div>

      {error && (
        <p style={{ color: 'red', marginTop: '10px' }}>
          <strong>Error:</strong> {error}
        </p>
      )}
    </div>
  );
};

export default DownloadTestPage;
