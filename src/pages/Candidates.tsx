import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, Trash, CheckCircle, X, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CreateCandidateForm } from "@/components/candidates/CreateCandidateForm";
import { CandidateDetails } from "@/components/candidates/CandidateDetails";
import { useToast } from "@/hooks/use-toast";
import { Candidate } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RBACWrapper } from "@/components/layout/RBACWrapper";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BulkImportCandidates } from "@/components/candidates/BulkImportCandidates";
import { ExportCandidates } from "@/components/candidates/ExportCandidates";

// Initial candidates data
const initialCandidates: Candidate[] = [
  {
    id: "1",
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    position: "Frontend Developer",
    status: "interview",
    date: "June 3, 2025",
    initials: "AM"
  },
  {
    id: "2",
    name: "Jordan Smith",
    email: "jordan.smith@example.com",
    position: "UX Designer",
    status: "new",
    date: "June 3, 2025",
    initials: "JS"
  },
  {
    id: "3",
    name: "Taylor Johnson",
    email: "taylor.johnson@example.com",
    position: "Product Manager",
    status: "reviewing",
    date: "June 2, 2025",
    initials: "TJ"
  },
  {
    id: "4",
    name: "Casey Wilson",
    email: "casey.wilson@example.com",
    position: "Backend Developer",
    status: "offer",
    date: "June 1, 2025",
    initials: "CW"
  },
  {
    id: "5",
    name: "Riley Parker",
    email: "riley.parker@example.com",
    position: "Marketing Specialist",
    status: "rejected",
    date: "May 31, 2025",
    initials: "RP"
  },
  {
    id: "6",
    name: "Jamie Lee",
    email: "jamie.lee@example.com",
    position: "Data Scientist",
    status: "new",
    date: "May 30, 2025",
    initials: "JL"
  },
  {
    id: "7",
    name: "Morgan Chen",
    email: "morgan.chen@example.com",
    position: "Full Stack Developer",
    status: "reviewing",
    date: "May 29, 2025",
    initials: "MC"
  },
  {
    id: "8",
    name: "Drew Garcia",
    email: "drew.garcia@example.com",
    position: "DevOps Engineer",
    status: "interview",
    date: "May 28, 2025",
    initials: "DG"
  }
];

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

const CandidatesPage = () => {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Candidate["status"] | "all">("all");
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [candidateToEdit, setCandidateToEdit] = useState<Candidate | null>(null);
  const [importSheetOpen, setImportSheetOpen] = useState(false);
  const [selectedJobPortal, setSelectedJobPortal] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);

  // Filter candidates based on search query and status
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || candidate.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle status filter change
  const handleStatusChange = (status: Candidate["status"] | "all") => {
    setSelectedStatus(status);
  };

  // Handle checkbox selection
  const handleSelectCandidate = (candidateId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedCandidates([...selectedCandidates, candidateId]);
    } else {
      setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId));
    }
  };

  // Handle select all checkbox
  const handleSelectAll = (isChecked: boolean) => {
    setIsAllSelected(isChecked);
    if (isChecked) {
      setSelectedCandidates(filteredCandidates.map(candidate => candidate.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  // Handle viewing candidate details
  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDetailsDialogOpen(true);
  };

  // Handle adding new candidate
  const handleAddCandidate = (candidateData: Omit<Candidate, "id" | "date" | "initials">) => {
    const nameParts = candidateData.name.split(" ");
    const initials = nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
      : candidateData.name.substring(0, 2);
    
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    const newCandidate: Candidate = {
      id: `${candidates.length + 1}`,
      date: formattedDate,
      initials: initials.toUpperCase(),
      ...candidateData
    };
    
    setCandidates([newCandidate, ...candidates]);
    toast({
      title: "Success",
      description: `${newCandidate.name} has been added to candidates.`,
    });
  };

  // Handle editing a candidate
  const handleEditCandidate = (candidate: Candidate) => {
    setCandidateToEdit(candidate);
    setEditDialogOpen(true);
  };

  // Handle updating a candidate
  const handleUpdateCandidate = (candidateData: Omit<Candidate, "id" | "date" | "initials">) => {
    if (candidateToEdit) {
      setCandidates(candidates.map(candidate => 
        candidate.id === candidateToEdit.id 
          ? { 
              ...candidate, 
              ...candidateData,
            }
          : candidate
      ));
      
      toast({
        title: "Candidate updated",
        description: `${candidateData.name} has been updated successfully.`,
      });
      
      setCandidateToEdit(null);
    }
  };

  // Handle deleting a candidate
  const handleDeleteCandidate = (candidateId: string) => {
    setCandidateToDelete(candidateId);
    setDeleteDialogOpen(true);
  };

  // Confirm single candidate deletion
  const confirmDeleteCandidate = () => {
    if (candidateToDelete) {
      setCandidates(candidates.filter(candidate => candidate.id !== candidateToDelete));
      setDeleteDialogOpen(false);
      setCandidateToDelete(null);
      toast({
        title: "Candidate deleted",
        description: "The candidate has been deleted successfully.",
      });
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedCandidates.length > 0) {
      setBulkDeleteDialogOpen(true);
    }
  };

  // Confirm bulk deletion
  const confirmBulkDelete = () => {
    setCandidates(candidates.filter(candidate => !selectedCandidates.includes(candidate.id)));
    setSelectedCandidates([]);
    setIsAllSelected(false);
    setBulkDeleteDialogOpen(false);
    toast({
      title: `${selectedCandidates.length} candidates deleted`,
      description: "The selected candidates have been deleted successfully.",
    });
  };

  // Handle updating candidate status
  const handleUpdateStatus = (candidateId: string, newStatus: Candidate["status"]) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, status: newStatus } 
        : candidate
    ));
    
    toast({
      title: "Status updated",
      description: `Candidate status has been updated to ${newStatus}.`,
    });
  };

  // Handle importing candidates from job portals
  const handleImportCandidates = async () => {
    if (!selectedJobPortal) {
      toast({
        title: "Error",
        description: "Please select a job portal.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      // In a real app, we would call an API here
      // For now, simulate an API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate importing candidates
      const importedCandidates: Candidate[] = [
        {
          id: `imported-${Date.now()}-1`,
          name: "Morgan Roberts",
          email: "morgan.roberts@example.com",
          position: "DevOps Engineer",
          status: "new",
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          initials: "MR"
        },
        {
          id: `imported-${Date.now()}-2`,
          name: "Taylor Swift",
          email: "taylor.swift@example.com",
          position: "UI/UX Designer",
          status: "new",
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          initials: "TS"
        }
      ];
      
      setCandidates([...importedCandidates, ...candidates]);
      setImportSheetOpen(false);
      toast({
        title: "Import successful",
        description: `Successfully imported ${importedCandidates.length} candidates from ${selectedJobPortal}.`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "An error occurred while importing candidates.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Handle exporting candidates to job portals
  const handleExportCandidates = async () => {
    if (selectedCandidates.length === 0) {
      toast({
        title: "No candidates selected",
        description: "Please select candidates to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, we would call an API here
      // For now, simulate an API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Export successful",
        description: `Successfully exported ${selectedCandidates.length} candidates to third-party job portals.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "An error occurred while exporting candidates.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout title="Candidates">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search candidates..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" />
                  {selectedStatus === "all" ? "All Statuses" : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleStatusChange("all")}>
                    {selectedStatus === "all" && <CheckCircle className="h-4 w-4 mr-2 text-primary" />}
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("new")}>
                    {selectedStatus === "new" && <CheckCircle className="h-4 w-4 mr-2 text-primary" />}
                    New
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("reviewing")}>
                    {selectedStatus === "reviewing" && <CheckCircle className="h-4 w-4 mr-2 text-primary" />}
                    Reviewing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("interview")}>
                    {selectedStatus === "interview" && <CheckCircle className="h-4 w-4 mr-2 text-primary" />}
                    Interview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("offer")}>
                    {selectedStatus === "offer" && <CheckCircle className="h-4 w-4 mr-2 text-primary" />}
                    Offer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("rejected")}>
                    {selectedStatus === "rejected" && <CheckCircle className="h-4 w-4 mr-2 text-primary" />}
                    Rejected
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <BulkImportCandidates onSuccess={() => {
              // Refresh candidates list
              toast({
                title: "Import successful",
                description: "Candidates list has been refreshed.",
              });
            }} />
            
            <ExportCandidates 
              candidates={candidates} 
              selectedOnly={false}
            />
            
            {/* Job Portal Integration */}
            <Sheet open={importSheetOpen} onOpenChange={setImportSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-1">
                  Import
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Import Candidates</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Select Job Portal</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {["LinkedIn", "Indeed", "Glassdoor", "Monster"].map((portal) => (
                        <Button
                          key={portal}
                          variant={selectedJobPortal === portal ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => setSelectedJobPortal(portal)}
                        >
                          {portal}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-ats-600 hover:bg-ats-700"
                    disabled={!selectedJobPortal || isImporting}
                    onClick={handleImportCandidates}
                  >
                    {isImporting ? "Importing..." : "Import Candidates"}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <RBACWrapper requiredPermission={{ action: 'create', subject: 'candidates' }}>
              <Button 
                className="gap-1 bg-ats-600 hover:bg-ats-700"
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Candidate
              </Button>
            </RBACWrapper>
          </div>
        </div>
        
        {selectedCandidates.length > 0 && (
          <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-md">
            <span className="text-sm font-medium">{selectedCandidates.length} selected</span>
            <div className="flex gap-2">
              <ExportCandidates 
                candidates={candidates}
                selectedOnly={true}
                selectedCandidates={selectedCandidates}
              />
              <RBACWrapper requiredPermission={{ action: 'delete', subject: 'candidates' }}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleBulkDelete}
                >
                  <Trash className="h-4 w-4 mr-1" /> Delete Selected
                </Button>
              </RBACWrapper>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedCandidates([]);
                  setIsAllSelected(false);
                }}
              >
                <X className="h-4 w-4 mr-1" /> Clear Selection
              </Button>
            </div>
          </div>
        )}
        
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 p-0">
                  <div className="flex items-center justify-center">
                    <Checkbox 
                      checked={isAllSelected} 
                      onCheckedChange={handleSelectAll}
                    />
                  </div>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Applied Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    No candidates found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id} className="hover:bg-muted/50">
                    <TableCell className="p-0">
                      <div className="flex items-center justify-center">
                        <Checkbox 
                          checked={selectedCandidates.includes(candidate.id)}
                          onCheckedChange={(checked) => handleSelectCandidate(candidate.id, !!checked)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => handleViewDetails(candidate)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-ats-100 text-ats-800 text-xs">
                            {candidate.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium hover:underline">{candidate.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {candidate.email}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {candidate.position}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              getStatusColor(candidate.status),
                              "cursor-pointer"
                            )}
                          >
                            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                          </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Update status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleUpdateStatus(candidate.id, "new")}>
                            New
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(candidate.id, "reviewing")}>
                            Reviewing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(candidate.id, "interview")}>
                            Interview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(candidate.id, "offer")}>
                            Offer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(candidate.id, "rejected")}>
                            Rejected
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {candidate.date}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <RBACWrapper requiredPermission={{ action: 'update', subject: 'candidates' }}>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => handleEditCandidate(candidate)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </RBACWrapper>
                        <RBACWrapper requiredPermission={{ action: 'delete', subject: 'candidates' }}>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteCandidate(candidate.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </RBACWrapper>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Create Candidate Dialog */}
      <CreateCandidateForm
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleAddCandidate}
        mode="create"
      />
      
      {/* Edit Candidate Dialog */}
      {candidateToEdit && (
        <CreateCandidateForm
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSubmit={handleUpdateCandidate}
          initialData={candidateToEdit}
          mode="edit"
        />
      )}
      
      {/* Candidate Details Dialog */}
      {selectedCandidate && (
        <CandidateDetails
          candidate={selectedCandidate}
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          onEdit={() => {
            setDetailsDialogOpen(false);
            handleEditCandidate(selectedCandidate);
          }}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              candidate from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCandidate}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedCandidates.length} candidates?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              {selectedCandidates.length === 1 ? " this candidate" : " these candidates"} from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete {selectedCandidates.length} {selectedCandidates.length === 1 ? "candidate" : "candidates"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default CandidatesPage;
