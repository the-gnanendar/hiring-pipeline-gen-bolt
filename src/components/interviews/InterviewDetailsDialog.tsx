
import { Interview } from "@/types";
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
import { Calendar, Clock, User, Calendar as CalendarIcon, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface InterviewDetailsDialogProps {
  interview: Interview;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (status: Interview["status"]) => void;
}

export function InterviewDetailsDialog({
  interview,
  open,
  onOpenChange,
  onStatusChange,
}: InterviewDetailsDialogProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState(interview.notes || "");

  const getInterviewTypeStyles = (type: Interview["type"]) => {
    switch (type) {
      case "technical":
        return "bg-blue-50 text-blue-600";
      case "culture":
        return "bg-green-50 text-green-600";
      case "screening":
        return "bg-amber-50 text-amber-600";
      case "final":
        return "bg-purple-50 text-purple-600";
    }
  };

  const getStatusStyles = (status: Interview["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-50 text-blue-600";
      case "completed":
        return "bg-green-50 text-green-600";
      case "cancelled":
        return "bg-red-50 text-red-600";
    }
  };

  const handleSaveNotes = () => {
    toast({
      title: "Notes saved",
      description: "Interview notes have been saved successfully.",
    });
  };

  const handleJoinCall = () => {
    toast({
      title: "Joining call",
      description: "Video conferencing feature will be implemented in the next phase.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Interview Details</DialogTitle>
            <Badge variant="secondary" className={cn(getStatusStyles(interview.status))}>
              {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-ats-100 text-ats-800 text-xl">
                {interview.candidate.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{interview.candidate.name}</h2>
              <p className="text-muted-foreground">{interview.candidate.position}</p>
              <div className="mt-1">
                <Badge variant="secondary" className={cn(getInterviewTypeStyles(interview.type))}>
                  {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Date & Time</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{interview.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{interview.time}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Interviewers</h3>
              <div className="space-y-2">
                {interview.interviewers.map((interviewer, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{interviewer.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Notes</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add interview notes here..."
              className="h-32"
            />
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <div className="flex gap-3 w-full sm:w-auto">
            <Button 
              variant="default" 
              onClick={handleSaveNotes}
              className="w-full sm:w-auto"
            >
              Save Notes
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            {interview.status === "scheduled" && (
              <>
                <Button 
                  onClick={() => onStatusChange("completed")}
                  variant="outline"
                  className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700 w-full sm:w-auto"
                >
                  Mark Completed
                </Button>
                <Button 
                  onClick={handleJoinCall}
                  className="bg-ats-600 hover:bg-ats-700 w-full sm:w-auto"
                >
                  <Video className="h-4 w-4 mr-1" />
                  Join Call
                </Button>
              </>
            )}
            
            {interview.status === "scheduled" && (
              <Button 
                onClick={() => onStatusChange("cancelled")}
                variant="outline"
                className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 w-full sm:w-auto"
              >
                Cancel Interview
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
