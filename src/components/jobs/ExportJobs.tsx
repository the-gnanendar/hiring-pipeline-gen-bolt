
import React from "react";
import { exportJobsToCSV } from "@/utils/csvUtils";
import { ExportButton } from "@/components/shared/ExportButton";
import { RBACWrapper } from "@/components/layout/RBACWrapper";

interface ExportJobsProps {
  jobs: any[];
}

export const ExportJobs: React.FC<ExportJobsProps> = ({ jobs }) => {
  const handleExportJobs = () => {
    exportJobsToCSV(jobs, `jobs_export_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <RBACWrapper requiredPermission={{ action: 'read', subject: 'jobs' }}>
      <ExportButton 
        onExport={handleExportJobs}
        entityName="Jobs"
        disabled={jobs.length === 0}
      />
    </RBACWrapper>
  );
};
