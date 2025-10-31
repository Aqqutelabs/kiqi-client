'use client';
import React, { useState, DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';

export const FileUpload = () => {
    const [isDragging, setIsDragging] = useState(false);

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
        // Handle the file upload logic here
        const files = e.dataTransfer.files;
        console.log(files);
    };

  return (
    <label
      htmlFor="file-upload"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()} // Necessary to allow drop
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${isDragging ? 'border-blue-500 bg-blue-50' : ''}`}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
        <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
        <p className="mb-2 text-sm text-gray-500">
          Drag and drop here or <span className="font-semibold text-blue-600">choose a file</span>
        </p>
        <p className="text-xs text-gray-400">All .doc, .word, .pdf, .csv, .xls file types are supported</p>
      </div>
      <input id="file-upload" type="file" className="hidden" />
    </label>
  );
};