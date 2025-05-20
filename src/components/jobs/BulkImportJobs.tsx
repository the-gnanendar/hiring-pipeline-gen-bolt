
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { jobsApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { BulkImportDialog } from "@/components/shared/BulkImportDialog";
import { sampleJobsCSV } from "@/utils/csvUtils";
import { UploadIcon } from "lucide-react";
import { RBACWrapper } from "@/components/layout/RBACWrapper";

interface BulkImportJobsProps {
  onSuccess: () => void;
}

export const BulkImportJobs: React.FC<BulkImportJobsProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImportJobs = async (data: any[]): Promise<void> => {
    setIsLoading(true);
    try {
      await jobsApi.bulkImport(data);
      toast({
        title: "Import successful",
        description: `Successfully imported ${data.length} jobs.`,
      });
      onSuccess();
    } catch (error) {
      console.error("Error importing jobs:", error);
      toast({
        title: "Import failed",
        description: "Failed to import jobs. Please check your CSV format.",
        variant: "destructive",
      });
      throw new Error("Failed to import jobs. Please check your CSV format.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <RBACWrapper requiredPermission={{ action: 'create', subject: 'jobs' }}>
        <Button 
          variant="outline" 
          onClick={() => setOpen(true)}
          className="gap-1"
          disabled={isLoading}
        >
          <UploadIcon className="h-4 w-4" /> Bulk Import
        </Button>
      </RBACWrapper>

      <BulkImportDialog
        open={open}
        onOpenChange={setOpen}
        onImport={handleImportJobs}
        sampleCsvData={sampleJobsCSV()}
        sampleFileName="ats_job_template.csv"
        entityName="Jobs"
      />
    </>
  );
};
