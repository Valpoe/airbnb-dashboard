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

  const columns = Object.keys(csvData[0]);

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div>
        <h1 className="text-xl mb-5">Upload Airbnb csv file with fields:</h1>
        <ul className="flex flex-wrap list-inside list-disc gap-2 mb-5">
          {columns.map((column, index) => (
            <li key={index}>
              <span className="badge badge-lg badge-primary">{column}</span>
            </li>
          ))}
        </ul>
        <FileUploadButton onDataUpload={handleDataUpload} />
        {csvData.length > 0 && (
          <>
            <ReactToPrint
              trigger={() => (
                <button className="btn mb-5 bg-neutral hover:text-accent mr-5 hover:bg-neutral">
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
