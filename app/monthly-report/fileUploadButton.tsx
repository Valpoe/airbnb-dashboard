import Papa, { ParseResult } from 'papaparse';

interface FileUploadButtonProps {
  onDataUpload: (data: any[]) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onDataUpload }) => {
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
              skipEmptyLines: true,
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

  return (
    <input
      type="file"
      className="file-input file-input-bordered w-full max-w-xs mb-5 me-5"
      onChange={handleFile}
    />
  );
};

export default FileUploadButton;
