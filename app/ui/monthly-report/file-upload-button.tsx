import Papa, { ParseResult } from 'papaparse';
import { useRef } from 'react';

interface FileUploadButtonProps {
  onDataUpload: (data: any[]) => void;
}

export default function FileUploadButton({
  onDataUpload
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          if (e.target) {
            const result = e.target.result as string;
            const parsedResult = Papa.parse(result, {
              header: true,
              dynamicTyping: true,
              skipEmptyLines: true
            }) as ParseResult<any>;

            onDataUpload(parsedResult.data);
          }
        } catch (error) {
          console.error('Error reading or parsing file:', error);
        }
      };

      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Clear data
    onDataUpload([]);
  };

  return (
    <>
      <input
        type="file"
        className="file-input file-input-bordered w-full max-w-xs mb-5 me-5"
        onChange={handleFile}
        ref={fileInputRef}
      />
      {fileInputRef.current && fileInputRef.current.value && (
        <button
          className="btn mb-5 bg-neutral hover:text-accent hover:bg-neutral me-5"
          onClick={handleClear}
        >
          Clear
        </button>
      )}
    </>
  );
}
