"use client";
import React, {
  useState,
  DragEvent,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { UploadCloud } from "lucide-react";

interface FileUploadProps {
  onChange?: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export interface FileUploadRef {
  clearFiles: () => void;
  getFiles: () => FileList | null;
}

export const FileUpload = forwardRef<FileUploadRef, FileUploadProps>(
  (
    {
      onChange,
      accept = ".doc,.docx,.pdf,.csv,.xls,.xlsx",
      multiple = false,
      className = "",
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
      clearFiles: () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      getFiles: () => {
        return fileInputRef.current?.files || null;
      },
    }));

    const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        // Update the file input with dropped files
        if (fileInputRef.current) {
          // Create a new DataTransfer object to set files
          const dataTransfer = new DataTransfer();
          Array.from(files).forEach((file) => dataTransfer.items.add(file));
          fileInputRef.current.files = dataTransfer.files;
        }

        if (onChange) {
          onChange(files);
        }
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (onChange) {
        onChange(files);
      }
    };

    return (
      <label
        htmlFor="file-upload"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${
          isDragging ? "border-orange-500 bg-orange-50" : ""
        } ${className}`}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500">
            Drag and drop here or{" "}
            <span className="font-semibold text-orange-600">choose a file</span>
          </p>
          <p className="text-xs text-gray-400">
            All .doc, .word, .pdf, .csv, .xls file types are supported
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          className="hidden"
        />
      </label>
    );
  }
);

FileUpload.displayName = "FileUpload";
