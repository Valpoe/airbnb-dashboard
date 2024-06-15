import cn from 'classnames';
import Papa, { ParseResult } from 'papaparse';
import { useRef } from 'react';
import styles from './styles.module.scss';

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
        className={cn('file-input', 'file-input-bordered', styles.fileInput)}
        onChange={handleFile}
        ref={fileInputRef}
      />
      {fileInputRef.current && fileInputRef.current.value && (
        <button
          className={cn('btn', 'btn-primary', styles.clearButton)}
          onClick={handleClear}
        >
          Clear
        </button>
      )}
    </>
  );
}
