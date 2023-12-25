// components/FileUploadButton.tsx
import CSVReader, { CSVReaderProps } from 'react-csv-reader';

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

  const csvReaderProps: Omit<CSVReaderProps, 'children'> = {
    onFileLoaded: handleFile,
    parserOptions: papaparseOptions,
  };

  return <CSVReader {...csvReaderProps} />;
};

export default FileUploadButton;
