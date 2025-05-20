
import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { APPLICATION_STAGES, ApplicationStage } from '@/types';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface ApplicationStageSelectProps {
  currentStage?: ApplicationStage;
  onStageChange: (stage: ApplicationStage) => void;
  disabled?: boolean;
}

export function ApplicationStageSelect({ 
  currentStage, 
  onStageChange,
  disabled = false
}: ApplicationStageSelectProps) {
  const { hasPermission } = useAuth();
  const [selectedStage, setSelectedStage] = useState<ApplicationStage | undefined>(
    currentStage || APPLICATION_STAGES[0]
  );
  
  const canUpdateCandidates = hasPermission('update', 'candidates');
  
  const handleStageChange = (stage: ApplicationStage) => {
    setSelectedStage(stage);
    onStageChange(stage);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        disabled={disabled || !canUpdateCandidates} 
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium",
          selectedStage?.color,
          "text-white hover:opacity-90 transition-opacity",
          (disabled || !canUpdateCandidates) && "opacity-60 cursor-not-allowed"
        )}
      >
        <span>{selectedStage?.name || "Select Stage"}</span>
        <ChevronDown size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {APPLICATION_STAGES.map((stage) => (
          <DropdownMenuItem
            key={stage.id}
            onClick={() => handleStageChange(stage)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", stage.color)} />
              <span>{stage.name}</span>
            </div>
            {selectedStage?.id === stage.id && <Check size={16} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
