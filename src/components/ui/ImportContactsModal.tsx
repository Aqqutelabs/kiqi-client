import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "./Button";
import Image from "next/image";
import { fileParser } from "@/lib/utils/fileParser";

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

  // Importing modal state
  const [showImportingModal, setShowImportingModal] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  // Guard to prevent re-trigger
  const hasStartedImportRef = useRef(false);

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
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(Array.from(e.target.files || []));
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      const isCSV = file.name.endsWith(".csv");
      const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
      const isUnder10MB = file.size <= 10 * 1024 * 1024;
      return (isCSV || isExcel) && isUnder10MB;
    });

    const filesWithProgress = validFiles.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading" as const,
    }));

    setFiles(filesWithProgress);

    filesWithProgress.forEach((file) => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId: number) => {
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

        // Start importing ONCE, after uploads visually finish
        if (!hasStartedImportRef.current) {
          hasStartedImportRef.current = true;

          setTimeout(() => {
            startImporting();
          }, 600);
        }
      }
    }, 200);
  };

  const parseFiles = async () => {
  const fileList = fileInputRef.current?.files;

  if (!fileList || fileList.length === 0) return;

  for (const file of Array.from(fileList)) {
    try {
      const parsedData = await fileParser(file);
      console.log("Parsed file:", file.name);
      console.table(parsedData);
    } catch (error) {
      console.error("Failed to parse", file.name, error);
    }
  }
};

  const startImporting = async () => {
    if (showImportingModal) return;

    setShowImportingModal(true);
    setImportProgress(0);

    await parseFiles();

    let progress = 0;

    const interval = setInterval(() => {
      progress += 20;
      setImportProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 400);
  };

  const removeFile = (fileId: number) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleCancel = () => {
    setFiles([]);
    setStep(1);
    setShowImportingModal(false);
    setImportProgress(0);
    hasStartedImportRef.current = false;
    onClose();
  };

  const handleImport = () => {
    onImportComplete?.(files);
    handleCancel();
  };

  if (!isOpen && !showImportingModal) return null;

  return (
    <>
      {isOpen && !showImportingModal && (
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
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
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
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#E8F2FF] rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-[#233E97]" />
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
                    className="px-6 py-2"
                  >
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
                            className="text-gray-400 hover:text-gray-600"
                          >
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

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={
                  files.length === 0 ||
                  files.some((f) => f.status !== "complete")
                }
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  files.length > 0 &&
                  files.every((f) => f.status === "complete")
                    ? "bg-[#233E97] text-white hover:bg-[#1a2f73]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Import Contacts
              </button>
            </div>
          </div>
        </div>
      )}
      {showImportingModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm px-8 py-10">
            <div className="flex flex-col items-center text-center gap-4">
              <span className="flex items-center justify-center text-xs font-medium text-black">
                {importProgress}%
              </span>
              <div className="relative w-52 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#009B54] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                />
              </div>

              <p className="text-xl font-medium text-[#111111]">
                Importing Contacts
              </p>

              <Button
                disabled={importProgress < 100}
                onClick={() => {
                  setShowImportingModal(false);
                  setImportProgress(0);
                }}
                className={`px-6 ${
                  importProgress === 100
                    ? "bg-[#233E97] text-white hover:bg-[#1a2f73]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
