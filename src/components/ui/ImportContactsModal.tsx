import { useState, useRef } from "react";
import { X, Upload, FileText, AlertCircle } from "lucide-react";
import { Button } from "./Button";
import Image from "next/image";

interface FileWithProgress {
  id: number;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "complete" | "error";
}

export function ImportContactsModal({
  isOpen,
  onClose,
  onImportComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: (files: FileWithProgress[]) => void;
}) {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles: File[]) => {
    // Filter for CSV and Excel files only
    const validFiles = newFiles.filter((file) => {
      const isCSV = file.name.endsWith(".csv");
      const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
      const isUnder10MB = file.size <= 10 * 1024 * 1024;
      return (isCSV || isExcel) && isUnder10MB;
    });

    // Simulate file processing
    const filesWithProgress = validFiles.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading" as const, // uploading, complete, error
    }));

    setFiles(filesWithProgress);

    // Simulate upload progress
    filesWithProgress.forEach((file, index) => {
      simulateUpload(file.id, index);
    });
  };

  const simulateUpload = (fileId: number, index: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
      );

      if (progress >= 100) {
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: "complete" } : f))
        );
      }
    }, 200);
  };

  const removeFile = (fileId: number) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleCancel = () => {
    setFiles([]);
    setStep(1);
    onClose();
  };

  const handleImport = () => {
    // Here you would process the files and import contacts
    onImportComplete?.(files);
    handleCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-semibold text-[#101828]">
              Import Contacts
            </h2>
            <p className="text-sm text-[#6A7282] mt-1">Step 1 of 3</p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-[#101828] mb-1">
              Upload File
            </h3>
            <p className="text-sm text-[#4A5565]">
              Upload a CSV or Excel file containing your contacts
            </p>
          </div>

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50"
            }`}>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#E8F2FF] rounded-full flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-[#F95417]" />
              </div>
              <p className="text-sm text-gray-900 mb-1">
                Drop your file here or click to browse
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Supports CSV and Excel files (max 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2">
                Select File
              </Button>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              {files.map((file) => (
                <div key={file.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Image
                        src={"/xls_svgrepo.com.svg"}
                        alt="file"
                        width={32}
                        height={32}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {file.status === "complete"
                            ? "Complete"
                            : "Uploading..."}
                        </p>
                      </div>
                    </div>
                    {file.status === "uploading" && (
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#009B54] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                    <span className="text-xs text-gray-600 font-medium">
                      {file.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* File Requirements */}
          <div className="mt-6 bg-[#EFF6FF] rounded-lg p-4">
            <div className="flex gap-3">
              <div>
                <p className="text-sm font-medium text-[#101828] mb-2">
                  File Requirements:
                </p>
                <ul className="text-xs text-[#4A5565] space-y-1">
                  <li>• First row should contain column headers</li>
                  <li>• Required columns: First Name, Last Name, Email</li>
                  <li>• Maximum 10,000 rows per import</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={
              files.length === 0 || files.some((f) => f.status !== "complete")
            }
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              files.length > 0 && files.every((f) => f.status === "complete")
                ? "bg-[#F95417] text-white hover:bg-[#1a2f73]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}>
            Import Contacts
          </button>
        </div>
      </div>
    </div>
  );
}
