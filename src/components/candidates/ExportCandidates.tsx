
import React from "react";
import { exportCandidatesToCSV } from "@/utils/csvUtils";
import { ExportButton } from "@/components/shared/ExportButton";
import { RBACWrapper } from "@/components/layout/RBACWrapper";

interface ExportCandidatesProps {
  candidates: any[];
  selectedOnly?: boolean;
  selectedCandidates?: string[];
}

export const ExportCandidates: React.FC<ExportCandidatesProps> = ({ 
  candidates, 
  selectedOnly = false, 
  selectedCandidates = [] 
}) => {
  const handleExportCandidates = () => {
    let dataToExport = candidates;
    
    if (selectedOnly && selectedCandidates.length > 0) {
      dataToExport = candidates.filter(candidate => 
        selectedCandidates.includes(candidate.id)
      );
    }
    
    exportCandidatesToCSV(
      dataToExport, 
      `candidates_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  return (
    <RBACWrapper requiredPermission={{ action: 'read', subject: 'candidates' }}>
      <ExportButton 
        onExport={handleExportCandidates}
        entityName={selectedOnly ? "Selected Candidates" : "Candidates"}
        disabled={(selectedOnly && selectedCandidates.length === 0) || candidates.length === 0}
      />
    </RBACWrapper>
  );
};
