"use client";
import { useState } from 'react';
import FileUploadButton from './fileUploadButton';
import DataTable from './dataTable';
import { Text } from '@tremor/react';

export default function Dashboard() {
  const [csvData, setCsvData] = useState<any[]>([]);

  const handleDataUpload = (data: any[]) => {
    setCsvData(data);
  };
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
    <div>
      <Text className="mb-5">Upload your Airbnb CSV file here</Text>
      <button className="btn">Upload</button>
      <div className="badge badge-secondary">Secondary</div>
      <FileUploadButton onDataUpload={handleDataUpload} />
      {csvData.length > 0 && <DataTable data={csvData} />}
    </div>
  </main>
  );
}