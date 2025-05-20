
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { candidatesApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { BulkImportDialog } from "@/components/shared/BulkImportDialog";
import { sampleCandidatesCSV } from "@/utils/csvUtils";
import { UploadIcon } from "lucide-react";
import { RBACWrapper } from "@/components/layout/RBACWrapper";

interface BulkImportCandidatesProps {
  onSuccess: () => void;
}

export const BulkImportCandidates: React.FC<BulkImportCandidatesProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImportCandidates = async (data: any[]): Promise<void> => {
    setIsLoading(true);
    try {
      await candidatesApi.bulkImport(data);
      toast({
        title: "Import successful",
        description: `Successfully imported ${data.length} candidates.`,
      });
      onSuccess();
    } catch (error) {
      console.error("Error importing candidates:", error);
      toast({
        title: "Import failed",
        description: "Failed to import candidates. Please check your CSV format.",
        variant: "destructive",
      });
      throw new Error("Failed to import candidates. Please check your CSV format.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <RBACWrapper requiredPermission={{ action: 'create', subject: 'candidates' }}>
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
        onImport={handleImportCandidates}
        sampleCsvData={sampleCandidatesCSV()}
        sampleFileName="ats_candidate_template.csv"
        entityName="Candidates"
      />
    </>
  );
};
