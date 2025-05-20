
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, Search, Filter, CheckCircle, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Interview } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ScheduleInterviewDialog } from "@/components/interviews/ScheduleInterviewDialog";
import { InterviewDetailsDialog } from "@/components/interviews/InterviewDetailsDialog";

const interviews: Interview[] = [
  {
    id: "1",
    candidate: {
      name: "Emma Davis",
      position: "Frontend Developer",
      initials: "ED"
    },
    interviewers: [
      { name: "John Smith", initials: "JS" },
      { name: "Alice Wong", initials: "AW" }
    ],
    date: "Today",
    time: "10:00 AM - 11:00 AM",
    type: "technical",
    status: "scheduled"
  },
  {
    id: "2",
    candidate: {
      name: "Michael Brown",
      position: "Product Manager",
      initials: "MB"
    },
    interviewers: [
      { name: "Sarah Johnson", initials: "SJ" }
    ],
    date: "Today",
    time: "2:00 PM - 3:00 PM",
    type: "culture",
    status: "scheduled"
  },
  {
    id: "3",
    candidate: {
      name: "Sophie Miller",
      position: "UX Designer",
      initials: "SM"
    },
    interviewers: [
      { name: "David Chen", initials: "DC" },
      { name: "Emma Wilson", initials: "EW" }
    ],
    date: "Tomorrow",
    time: "9:30 AM - 10:30 AM",
    type: "screening",
    status: "scheduled"
  },
  {
    id: "4",
    candidate: {
      name: "James Wilson",
      position: "Backend Developer",
      initials: "JW"
    },
    interviewers: [
      { name: "Robert Taylor", initials: "RT" },
      { name: "Jennifer Lee", initials: "JL" },
      { name: "Mark Garcia", initials: "MG" }
    ],
    date: "Tomorrow",
    time: "1:00 PM - 2:30 PM",
    type: "final",
    status: "scheduled"
  },
  {
    id: "5",
    candidate: {
      name: "Olivia Martinez",
      position: "Marketing Specialist",
      initials: "OM"
    },
    interviewers: [
      { name: "Thomas Wright", initials: "TW" }
    ],
    date: "Jun 10",
    time: "11:00 AM - 12:00 PM",
    type: "screening",
    status: "scheduled"
  }
];

const getInterviewTypeStyles = (type: Interview["type"]) => {
  switch (type) {
    case "technical":
      return "border-blue-200 bg-blue-50";
    case "culture":
      return "border-green-200 bg-green-50";
    case "screening":
      return "border-amber-200 bg-amber-50";
    case "final":
      return "border-purple-200 bg-purple-50";
  }
};

const InterviewsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<Interview["type"] | "all">("all");
  const [interviewsList, setInterviewsList] = useState<Interview[]>(interviews);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Filter interviews based on search query and selected type
  const filteredInterviews = interviewsList.filter((interview) => {
    const matchesSearch = 
      interview.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === "all" || interview.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle interview type filter change
  const handleTypeChange = (type: Interview["type"] | "all") => {
    setSelectedType(type);
  };
  
  // Handle scheduling a new interview
  const handleScheduleInterview = () => {
    setScheduleDialogOpen(true);
  };
  
  // Handle viewing interview details
  const handleViewDetails = (interview: Interview) => {
    setSelectedInterview(interview);
    setDetailsDialogOpen(true);
  };

  // Handle adding a new interview
  const handleAddInterview = (interviewData: Omit<Interview, "id">) => {
    const newInterview: Interview = {
      id: `${interviewsList.length + 1}`,
      ...interviewData
    };
    
    setInterviewsList([...interviewsList, newInterview]);
    toast({
      title: "Interview scheduled",
      description: `Interview with ${interviewData.candidate.name} has been scheduled.`,
    });
  };

  // Handle updating interview status
  const handleUpdateStatus = (interviewId: string, newStatus: Interview["status"]) => {
    setInterviewsList(interviewsList.map(interview => 
      interview.id === interviewId 
        ? { ...interview, status: newStatus } 
        : interview
    ));
    
    toast({
      title: "Status updated",
      description: `Interview status updated to ${newStatus}.`,
    });
  };
  
  // Handle joining interview call
  const handleJoinCall = (interviewId: string) => {
    toast({
      title: "Joining call",
      description: "Video conferencing feature will be implemented in the next phase.",
    });
  };

  // Filter interviews by selected date
  const interviewsByDate = selectedDate 
    ? filteredInterviews.filter(interview => {
        // In a real app, we would compare actual dates
        return interview.date === "Today" || interview.date === "Tomorrow" || interview.date === "Jun 10";
      })
    : filteredInterviews;

  return (
    <Layout title="Interviews">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search interviews..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" />
                  {selectedType === "all" ? "All Types" : selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52">
                <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleTypeChange("all")}>
                    {selectedType === "all" && <CheckCircle className="h-4 w-4 mr-2 text-primary" />}
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTypeChange("technical")}>
                    {selectedType === "technical" && <CheckCircle className="h-4 w-4 mr-2 text-primary" />}
                    Technical
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTypeChange("culture")}>
                    {selectedType === "culture" && <CheckCircle className="h-4 w-4 mr-2 text-primary" />}
                    Culture
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTypeChange("screening")}>
                    {selectedType === "screening" && <CheckCircle className="h-4 w-4 mr-2 text-primary" />}
                    Screening
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTypeChange("final")}>
                    {selectedType === "final" && <CheckCircle className="h-4 w-4 mr-2 text-primary" />}
                    Final
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              className="gap-1 bg-ats-600 hover:bg-ats-700"
              onClick={handleScheduleInterview}
            >
              <Plus className="h-4 w-4" />
              Schedule Interview
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 space-y-6">
            <h2 className="text-lg font-semibold">Upcoming Interviews</h2>
            
            <div className="space-y-4">
              {interviewsByDate.length === 0 ? (
                <div className="text-center py-10 border rounded-md bg-background">
                  <p className="text-muted-foreground">No interviews found matching your criteria.</p>
                </div>
              ) : (
                interviewsByDate.map((interview) => (
                  <Card 
                    key={interview.id}
                    className={cn("border-l-4", getInterviewTypeStyles(interview.type))}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-ats-100 text-ats-800">
                              {interview.candidate.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{interview.candidate.name}</CardTitle>
                            <CardDescription>{interview.candidate.position}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{interview.date}</div>
                          <div className="text-sm text-muted-foreground">{interview.time}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Interviewers</div>
                          <div className="flex -space-x-2 mt-1">
                            {interview.interviewers.map((interviewer, index) => (
                              <Avatar key={index} className="border-2 border-white h-7 w-7">
                                <AvatarFallback className="text-xs">
                                  {interviewer.initials}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                interview.status === "scheduled" ? "bg-blue-50 text-blue-600" : 
                                interview.status === "completed" ? "bg-green-50 text-green-600" : 
                                "bg-red-50 text-red-600",
                                "cursor-pointer"
                              )}
                            >
                              {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                            </Badge>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Update status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUpdateStatus(interview.id, "scheduled")}>
                              Scheduled
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(interview.id, "completed")}>
                              Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(interview.id, "cancelled")}>
                              Cancelled
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex w-full gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(interview)}>Details</Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleJoinCall(interview.id)}
                        >
                          Join Call
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Calendar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar 
                  mode="single" 
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border" 
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Schedule Interview Dialog */}
      <ScheduleInterviewDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        onSubmit={handleAddInterview}
      />
      
      {/* Interview Details Dialog */}
      {selectedInterview && (
        <InterviewDetailsDialog
          interview={selectedInterview}
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          onStatusChange={(status) => handleUpdateStatus(selectedInterview.id, status)}
        />
      )}
    </Layout>
  );
};

export default InterviewsPage;
