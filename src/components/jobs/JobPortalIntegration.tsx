
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { jobPortalsApi } from "@/services/api";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { ChevronDown, ExternalLink, Upload, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface JobPortalIntegrationProps {
  jobId?: string;
  onJobImported?: () => void;
  onCandidatesImported?: () => void;
}

export const JobPortalIntegration = ({ 
  jobId, 
  onJobImported, 
  onCandidatesImported 
}: JobPortalIntegrationProps) => {
  const { toast } = useToast();
  const [sources, setSources] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load available job portals when component mounts
  useState(() => {
    const loadSources = async () => {
      try {
        const availableSources = await jobPortalsApi.getSources();
        setSources(availableSources);
      } catch (error) {
        console.error("Error loading job portal sources:", error);
        toast({
          title: "Failed to load job portals",
          description: "Could not retrieve the list of available job portals.",
          variant: "destructive",
        });
        // Set some default sources for demo purposes
        setSources(['LinkedIn', 'Indeed', 'Glassdoor', 'ZipRecruiter']);
      }
    };
    
    loadSources();
  }, []);
  
  // Import jobs from a selected portal
  const handleImportJobs = async (source: string) => {
    setIsLoading(true);
    
    try {
      // Check if API key is available
      const apiKey = localStorage.getItem("jobPortalApiKey");
      if (!apiKey) {
        toast({
          title: "API Key Missing",
          description: "Please add your job portal API key in the Settings page.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const importedJobs = await jobPortalsApi.importJobs(source);
      
      toast({
        title: "Jobs Imported",
        description: `Successfully imported ${importedJobs.length} jobs from ${source}.`,
      });
      
      if (onJobImported) {
        onJobImported();
      }
    } catch (error) {
      console.error(`Error importing jobs from ${source}:`, error);
      toast({
        title: "Import Failed",
        description: `Could not import jobs from ${source}. Please check your API key.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Export job to a selected portal
  const handleExportJob = async (destination: string) => {
    if (!jobId) {
      toast({
        title: "No Job Selected",
        description: "Please select a job to export.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if API key is available
      const apiKey = localStorage.getItem("jobPortalApiKey");
      if (!apiKey) {
        toast({
          title: "API Key Missing",
          description: "Please add your job portal API key in the Settings page.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      await jobPortalsApi.exportJobs([jobId], destination);
      
      toast({
        title: "Job Exported",
        description: `Successfully exported job to ${destination}.`,
      });
    } catch (error) {
      console.error(`Error exporting job to ${destination}:`, error);
      toast({
        title: "Export Failed",
        description: `Could not export job to ${destination}. Please check your API key.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Import candidates from a selected portal
  const handleImportCandidates = async (source: string) => {
    setIsLoading(true);
    
    try {
      // Check if API key is available
      const apiKey = localStorage.getItem("jobPortalApiKey");
      if (!apiKey) {
        toast({
          title: "API Key Missing",
          description: "Please add your job portal API key in the Settings page.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const importedCandidates = await jobPortalsApi.importCandidates(source);
      
      toast({
        title: "Candidates Imported",
        description: `Successfully imported ${importedCandidates.length} candidates from ${source}.`,
      });
      
      if (onCandidatesImported) {
        onCandidatesImported();
      }
    } catch (error) {
      console.error(`Error importing candidates from ${source}:`, error);
      toast({
        title: "Import Failed",
        description: `Could not import candidates from ${source}. Please check your API key.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Portal Integration</CardTitle>
        <CardDescription>
          Publish jobs to external job boards and source candidates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {sources.map((source) => (
            <Badge key={source} variant="outline" className="p-1.5">
              {source}
              <ExternalLink className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          {/* Import Jobs Menu */}
          <Menubar className="border-none p-0">
            <MenubarMenu>
              <MenubarTrigger asChild>
                <Button variant="outline" disabled={isLoading}>
                  <Download className="mr-2 h-4 w-4" />
                  Import Jobs
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </MenubarTrigger>
              <MenubarContent>
                {sources.map((source) => (
                  <MenubarItem key={source} onClick={() => handleImportJobs(source)}>
                    From {source}
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          
          {/* Import Candidates Menu */}
          <Menubar className="border-none p-0">
            <MenubarMenu>
              <MenubarTrigger asChild>
                <Button variant="outline" disabled={isLoading}>
                  <Download className="mr-2 h-4 w-4" />
                  Import Candidates
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </MenubarTrigger>
              <MenubarContent>
                {sources.map((source) => (
                  <MenubarItem key={source} onClick={() => handleImportCandidates(source)}>
                    From {source}
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        
        {/* Export Job Menu - only shown when a job is selected */}
        {jobId && (
          <Menubar className="border-none p-0">
            <MenubarMenu>
              <MenubarTrigger asChild>
                <Button variant="default" className="bg-ats-600 hover:bg-ats-700" disabled={isLoading}>
                  <Upload className="mr-2 h-4 w-4" />
                  Publish Job
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </MenubarTrigger>
              <MenubarContent>
                {sources.map((source) => (
                  <MenubarItem key={source} onClick={() => handleExportJob(source)}>
                    To {source}
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        )}
      </CardFooter>
    </Card>
  );
};
