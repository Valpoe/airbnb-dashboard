'use client';
import { useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import DataTable from './dataTable';
import FileUploadButton from './fileUploadButton';
import './printTable.css';

export default function Dashboard() {
  const [csvData, setCsvData] = useState<any[]>([]);
  const contentRef = useRef(null);

  const handleDataUpload = (data: any[]) => {
    setCsvData(data);
  };

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div>
        <h1 className="text-xl mb-5">Upload Airbnb csv file with fields:</h1>
        <ul className="flex flex-row list-inside list-disc mb-5 space-x-2">
          <li>Type</li>
          <li>Booking Date</li>
          <li>Nights</li>
          <li>Guest</li>
          <li>Listing</li>
          <li>Currency</li>
          <li>Amount</li>
          <li>Host Fee</li>
        </ul>
        <FileUploadButton onDataUpload={handleDataUpload} />
        {csvData.length > 0 && (
          <>
            <ReactToPrint
              trigger={() => (
                <button className="btn mb-5 bg-primary hover:text-accent">
                  Download Report
                </button>
              )}
              content={() => contentRef.current}
              documentTitle="Airbnb Report"
            />
          </>
        )}
        {csvData.length > 0 && (
          <DataTable data={csvData} contentRef={contentRef} />
        )}
      </div>
    </main>
  );
}
