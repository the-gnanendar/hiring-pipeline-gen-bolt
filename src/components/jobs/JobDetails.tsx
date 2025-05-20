
import React from "react";
import { Job } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Share2, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobDetailsProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}

export function JobDetails({ job, open, onOpenChange, onEdit }: JobDetailsProps) {
  const getJobTypeColor = (type: Job["type"]) => {
    switch (type) {
      case "full-time":
        return "bg-blue-50 text-blue-600 hover:bg-blue-100";
      case "part-time":
        return "bg-purple-50 text-purple-600 hover:bg-purple-100";
      case "contract":
        return "bg-amber-50 text-amber-600 hover:bg-amber-100";
      case "remote":
        return "bg-teal-50 text-teal-600 hover:bg-teal-100";
    }
  };

  const getJobStatusColor = (status: Job["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-600 hover:bg-green-100";
      case "draft":
        return "bg-gray-50 text-gray-600 hover:bg-gray-100";
      case "closed":
        return "bg-red-50 text-red-600 hover:bg-red-100";
      case "on-hold":
        return "bg-amber-50 text-amber-600 hover:bg-amber-100";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mb-1">
            <Badge variant="secondary" className={cn(getJobStatusColor(job.status))}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
            <Badge variant="secondary" className={cn(getJobTypeColor(job.type))}>
              {job.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold">{job.title}</DialogTitle>
          <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-2 mt-1">
            <span>{job.department}</span>
            <span>•</span>
            <span>{job.location}</span>
            {job.salary && (
              <>
                <span>•</span>
                <span>
                  {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                </span>
              </>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{job.applicants} applicants</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{job.postedDate}</span>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {job.description && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{job.description}</p>
            </div>
          )}
          
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Requirements</h3>
              <ul className="list-disc pl-5 space-y-1">
                {job.requirements.map((req, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{req}</li>
                ))}
              </ul>
            </div>
          )}
          
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-1">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{resp}</li>
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
            <Button variant="outline" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
          {onEdit && (
            <Button onClick={onEdit} size="sm" className="gap-1 bg-ats-600 hover:bg-ats-700">
              <Pencil className="h-4 w-4" />
              Edit Job
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
