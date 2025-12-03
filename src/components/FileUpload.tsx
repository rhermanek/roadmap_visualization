import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { clsx } from 'clsx';

interface FileUploadProps {
  onUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onUpload(e.dataTransfer.files[0]);
      }
    },
    [onUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onUpload(e.target.files[0]);
      }
    },
    [onUpload]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={clsx(
        "w-full max-w-2xl mx-auto mt-10 p-12 border-2 border-dashed rounded-xl",
        "border-gray-300 bg-gray-50/50 hover:bg-gray-100 hover:border-blue-500",
        "dark:border-gray-600 dark:bg-gray-800/50 dark:hover:bg-gray-800 dark:hover:border-blue-500",
        "transition-all duration-300 ease-in-out cursor-pointer",
        "flex flex-col items-center justify-center text-center group"
      )}
    >
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer w-full h-full flex flex-col items-center">
        <div className="p-4 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 group-hover:bg-blue-500/20 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors mb-4">
          <Upload size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Upload Roadmap Excel
        </h3>
        <p className="text-gray-400 text-sm">
          Drag and drop your file here, or click to select
        </p>
        <p className="text-gray-500 text-xs mt-4">
          Supports Type 1 and Type 2 formats
        </p>
      </label>
    </div>
  );
};
