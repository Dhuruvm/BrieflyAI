import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  className?: string;
}

export default function UploadZone({ 
  onFileSelect, 
  isUploading = false,
  className 
}: UploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'video/*': ['.mp4']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "upload-zone bg-gray-50 dark:bg-gray-700 border-2 border-dashed transition-all duration-300 cursor-pointer mb-6",
        isDragActive ? "border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-gray-600" : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
        isUploading && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <CardContent className="p-8 lg:p-12 text-center">
        <input {...getInputProps()} />
        <div className="mb-6">
          <i className={cn(
            "text-6xl mb-4",
            isDragActive ? "fas fa-cloud-download-alt text-gray-600 dark:text-gray-400" : "fas fa-cloud-upload-alt text-gray-500 dark:text-gray-400"
          )}></i>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {isDragActive ? "Drop your file here" : "Drag & Drop Your Files"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {isUploading ? "Processing..." : "or click to browse"}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span><i className="fas fa-file-text mr-1"></i>Text</span>
          <span><i className="fas fa-file-pdf mr-1"></i>PDF</span>
          <span><i className="fas fa-microphone mr-1"></i>Audio</span>
          <span><i className="fas fa-video mr-1"></i>Video</span>
        </div>
      </CardContent>
    </Card>
  );
}
