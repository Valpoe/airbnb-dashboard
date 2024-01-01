"use client";
import { useRef, useState } from 'react';
import FileUploadButton from './fileUploadButton';
import DataTable from './dataTable';
import ReactToPrint from 'react-to-print';
import "./printTable.css";

export default function Dashboard() {
  const [csvData, setCsvData] = useState<any[]>([]);
  const contentRef = useRef(null);

  const handleDataUpload = (data: any[]) => {
    setCsvData(data);
  };

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
    <div>
      <h1 className="text-xl mb-5">Upload CSV File</h1>
      <FileUploadButton onDataUpload={handleDataUpload} />
      {csvData.length > 0 && (
          <>
            <ReactToPrint
              trigger={() => <button className="btn mb-5 bg-primary hover:text-accent">Download Report</button>}
              content={() => contentRef.current}
              documentTitle='Airbnb Report'
            />
          </>
        )}
      {csvData.length > 0 && <DataTable data={csvData} contentRef={contentRef} />}
      
    </div>
  </main>
  );
}