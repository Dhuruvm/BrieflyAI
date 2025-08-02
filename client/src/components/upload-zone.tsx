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
        "modern-surface border-2 border-dashed transition-all duration-300 cursor-pointer mb-6",
        isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        isUploading && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <CardContent className="p-8 lg:p-12 text-center">
        <input {...getInputProps()} />
        <div className="mb-6">
          <div className="text-6xl mb-4 flex justify-center">
            {isDragActive ? "📥" : "📁"}
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            {isDragActive ? "Drop your file here" : "Drag & Drop Your Files"}
          </h3>
          <p className="text-muted-foreground">
            {isUploading ? "Processing..." : "or click to browse"}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <span>📄 Text</span>
          <span>📋 PDF</span>
          <span>🎙️ Audio</span>
          <span>🎬 Video</span>
        </div>
      </CardContent>
    </Card>
  );
}
