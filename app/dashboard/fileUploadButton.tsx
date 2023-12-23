// components/FileUploadButton.tsx
import CSVReader, { CSVReaderProps } from 'react-csv-reader';
import { useState } from 'react';


interface FileUploadButtonProps {
  onDataUpload: (data: any[]) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onDataUpload }) => {
  const handleFile = (data: any[]) => {
    onDataUpload(data);
  };

  const papaparseOptions: CSVReaderProps['parserOptions'] = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  };

  return (
    <CSVReader
      onFileLoaded={handleFile}
      parserOptions={papaparseOptions}
    >
    </CSVReader>
  );
};

export default FileUploadButton;
