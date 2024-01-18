'use client';
import FileUploadButton from '@/app/ui/monthly-report/file-upload-button';
import '@/app/ui/monthly-report/print-table.css';
import DataTable from '@/app/ui/monthly-report/table';
import { useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';

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
        <h1 className="text-xl mb-5">Upload CSV File</h1>
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
