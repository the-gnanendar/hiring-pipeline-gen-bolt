
import React from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  onExport: () => void;
  entityName: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  entityName,
  variant = "outline",
  disabled = false
}) => {
  const { toast } = useToast();

  const handleExport = () => {
    try {
      onExport();
      toast({
        title: "Export successful",
        description: `Successfully exported ${entityName} data to CSV.`,
      });
    } catch (error) {
      console.error(`Error exporting ${entityName}:`, error);
      toast({
        title: "Export failed",
        description: `Failed to export ${entityName} data.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleExport}
      className="gap-1"
      disabled={disabled}
    >
      <DownloadIcon className="h-4 w-4" /> Export CSV
    </Button>
  );
};
