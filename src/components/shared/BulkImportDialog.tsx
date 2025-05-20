import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { downloadCSV } from "@/utils/csvUtils";
import { useToast } from "@/hooks/use-toast";
import { DownloadIcon, FileTextIcon, UploadIcon } from "lucide-react";

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: any[]) => Promise<void>;
  sampleCsvData: string;
  sampleFileName: string;
  entityName: string;
}

export const BulkImportDialog: React.FC<BulkImportDialogProps> = ({
  open,
  onOpenChange,
  onImport,
  sampleCsvData,
  sampleFileName,
  entityName
}) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDownloadSample = () => {
    downloadCSV(sampleCsvData, sampleFileName);
    toast({
      title: "Sample CSV downloaded",
      description: `A sample ${entityName} CSV file has been downloaded.`
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive"
      });
      return;
    }
    setFile(file);
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      const jsonData = [];

      // Parse CSV to JSON
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        const entry: Record<string, any> = {};
        
        headers.forEach((header, index) => {
          entry[header.trim()] = values[index]?.trim() || '';
        });
        
        jsonData.push(entry);
      }

      // Send to API
      await onImport(jsonData);
      
      setFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import {entityName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? "border-primary bg-primary/10" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-3">
              <FileTextIcon className="h-10 w-10 text-gray-400" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {file ? file.name : `Drag & drop your ${entityName} CSV file here`}
                </p>
                <p className="text-xs text-gray-500">
                  {file ? `${Math.round(file.size / 1024)} KB` : "CSV files only, up to 5MB"}
                </p>
              </div>
              <div className="pt-2">
                <label className="cursor-pointer">
                  <span className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Select CSV File
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Need a template?
            </p>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDownloadSample}
            >
              <DownloadIcon className="h-4 w-4" /> Download Sample CSV
            </Button>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || isUploading}
            className="gap-2"
          >
            {isUploading ? "Importing..." : (
              <>
                <UploadIcon className="h-4 w-4" /> 
                Import {entityName}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
