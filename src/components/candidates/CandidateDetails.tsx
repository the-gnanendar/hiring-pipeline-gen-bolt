
import { useState } from 'react';
import { Candidate, APPLICATION_STAGES } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Download, Mail, Phone, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApplicationStageSelect } from "./ApplicationStageSelect";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RBACWrapper } from "@/components/layout/RBACWrapper";

interface CandidateDetailsProps {
  candidate: Candidate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onStageChange?: (candidateId: string, stageId: string) => void;
}

export function CandidateDetails({
  candidate,
  open,
  onOpenChange,
  onEdit,
  onStageChange,
}: CandidateDetailsProps) {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [currentStage, setCurrentStage] = useState(
    candidate.applicationStage || APPLICATION_STAGES[0]
  );
  
  const getStatusColor = (status: Candidate["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-50 text-blue-600 hover:bg-blue-100";
      case "reviewing":
        return "bg-amber-50 text-amber-600 hover:bg-amber-100";
      case "interview":
        return "bg-purple-50 text-purple-600 hover:bg-purple-100";
      case "offer":
        return "bg-green-50 text-green-600 hover:bg-green-100";
      case "rejected":
        return "bg-gray-50 text-gray-600 hover:bg-gray-100";
    }
  };

  const handleStageChange = (stage: typeof APPLICATION_STAGES[0]) => {
    setCurrentStage(stage);
    
    if (onStageChange) {
      onStageChange(candidate.id, stage.id);
      
      toast({
        title: "Stage updated",
        description: `Candidate moved to "${stage.name}" stage.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-ats-100 text-ats-800 text-xl">
                {candidate.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl font-bold">{candidate.name}</DialogTitle>
              <p className="text-muted-foreground">{candidate.position}</p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary" className={cn(getStatusColor(candidate.status))}>
              {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
            </Badge>
            {candidate.experience && (
              <Badge variant="outline">{candidate.experience} years of experience</Badge>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Application Stage</h3>
              <RBACWrapper requiredPermission={{ action: 'update', subject: 'candidates' }}>
                <ApplicationStageSelect 
                  currentStage={currentStage}
                  onStageChange={handleStageChange}
                />
              </RBACWrapper>
            </div>
            
            {currentStage?.description && (
              <p className="text-sm text-muted-foreground">{currentStage.description}</p>
            )}
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a 
                href={`mailto:${candidate.email}`}
                className="text-sm hover:underline"
              >
                {candidate.email}
              </a>
            </div>
            
            {candidate.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`tel:${candidate.phone}`}
                  className="text-sm hover:underline"
                >
                  {candidate.phone}
                </a>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Applied on {candidate.date}</span>
            </div>
          </div>
          
          {candidate.education && candidate.education.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Education</h3>
              <ul className="list-disc pl-5 space-y-1">
                {candidate.education.map((edu, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{edu}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {candidate.resume && (
              <Button variant="outline" size="sm" className="gap-1" asChild>
                <a href={candidate.resume} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" />
                  Resume
                </a>
              </Button>
            )}
          </div>
          {onEdit && (
            <RBACWrapper requiredPermission={{ action: 'update', subject: 'candidates' }}>
              <Button onClick={onEdit} size="sm" className="gap-1 bg-ats-600 hover:bg-ats-700">
                <Pencil className="h-4 w-4" />
                Edit Candidate
              </Button>
            </RBACWrapper>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
