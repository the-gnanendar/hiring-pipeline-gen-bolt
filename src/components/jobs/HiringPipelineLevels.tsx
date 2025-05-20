
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RBACWrapper } from "@/components/layout/RBACWrapper";
import { Pencil, Trash2, Plus } from "lucide-react";
import { User } from "@/types";

// Define a type for pipeline level
interface PipelineLevel {
  id: string;
  name: string;
  description: string;
  assignedUsers: string[]; // Array of user IDs
  order: number;
  jobId: string;
}

// Props for the component
interface HiringPipelineLevelsProps {
  jobId: string;
  users: User[];
}

// Form schema for adding/editing a pipeline level
const levelSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  assignedUsers: z.array(z.string()).optional(),
  order: z.number().optional(),
});

type LevelFormValues = z.infer<typeof levelSchema>;

export const HiringPipelineLevels = ({ jobId, users }: HiringPipelineLevelsProps) => {
  const { toast } = useToast();
  const [levels, setLevels] = useState<PipelineLevel[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<PipelineLevel | null>(null);

  // Initialize form for adding/editing levels
  const form = useForm<LevelFormValues>({
    resolver: zodResolver(levelSchema),
    defaultValues: {
      name: "",
      description: "",
      assignedUsers: [],
      order: 0,
    },
  });

  // Load levels when component mounts or jobId changes
  useEffect(() => {
    if (jobId) {
      // In a real application, you would fetch levels from the API
      // For now, we'll use some mock data
      const mockLevels: PipelineLevel[] = [
        {
          id: "1",
          name: "Resume Screening",
          description: "Initial review of candidate resumes",
          assignedUsers: ["user1", "user2"],
          order: 1,
          jobId,
        },
        {
          id: "2",
          name: "Phone Interview",
          description: "Initial phone screening with candidates",
          assignedUsers: ["user3"],
          order: 2,
          jobId,
        },
        {
          id: "3",
          name: "Technical Assessment",
          description: "Technical skills evaluation",
          assignedUsers: ["user1", "user4"],
          order: 3,
          jobId,
        },
      ];
      
      setLevels(mockLevels);
    }
  }, [jobId]);

  // Handle form submission for adding a new level
  const handleAddLevel = (values: LevelFormValues) => {
    // In a real application, you would call an API to save the level
    const newLevel: PipelineLevel = {
      id: Date.now().toString(), // Generate a temporary ID
      name: values.name,
      description: values.description || "",
      assignedUsers: values.assignedUsers || [],
      order: levels.length + 1,
      jobId,
    };
    
    setLevels([...levels, newLevel]);
    setIsAddDialogOpen(false);
    form.reset();
    
    toast({
      title: "Level added",
      description: `${values.name} has been added to the pipeline.`,
    });
  };

  // Handle form submission for editing a level
  const handleEditLevel = (values: LevelFormValues) => {
    if (!editingLevel) return;
    
    // In a real application, you would call an API to update the level
    const updatedLevels = levels.map(level => 
      level.id === editingLevel.id 
        ? { 
            ...level, 
            name: values.name, 
            description: values.description || "", 
            assignedUsers: values.assignedUsers || [] 
          } 
        : level
    );
    
    setLevels(updatedLevels);
    setIsEditDialogOpen(false);
    setEditingLevel(null);
    form.reset();
    
    toast({
      title: "Level updated",
      description: `${values.name} has been updated.`,
    });
  };

  // Set up the edit form when editing a level
  const handleEditClick = (level: PipelineLevel) => {
    setEditingLevel(level);
    form.reset({
      name: level.name,
      description: level.description,
      assignedUsers: level.assignedUsers,
      order: level.order,
    });
    setIsEditDialogOpen(true);
  };

  // Handle deleting a level
  const handleDeleteLevel = (levelId: string) => {
    // In a real application, you would call an API to delete the level
    const updatedLevels = levels.filter(level => level.id !== levelId);
    // Re-order remaining levels
    const reorderedLevels = updatedLevels.map((level, index) => ({
      ...level,
      order: index + 1,
    }));
    
    setLevels(reorderedLevels);
    
    toast({
      title: "Level deleted",
      description: "The pipeline level has been removed.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Hiring Pipeline Levels</h2>
        <RBACWrapper requiredPermission={{ action: 'create', subject: 'jobs' }}>
          <Button 
            onClick={() => {
              form.reset({
                name: "",
                description: "",
                assignedUsers: [],
              });
              setIsAddDialogOpen(true);
            }}
            className="bg-ats-600 hover:bg-ats-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Level
          </Button>
        </RBACWrapper>
      </div>

      {levels.length === 0 ? (
        <Card>
          <CardContent className="py-6">
            <div className="text-center text-gray-500">
              <p>No pipeline levels have been created for this job yet.</p>
              <p className="text-sm mt-1">Create levels to define the hiring process.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {levels.map((level) => (
            <Card key={level.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium">
                    {level.order}. {level.name}
                  </CardTitle>
                  <RBACWrapper requiredPermission={{ action: 'update', subject: 'jobs' }}>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(level)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit level</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteLevel(level.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete level</span>
                      </Button>
                    </div>
                  </RBACWrapper>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {level.description && (
                    <p className="text-sm text-gray-500">{level.description}</p>
                  )}
                  <div>
                    <h4 className="text-sm font-medium mb-1">Assigned Users:</h4>
                    <div className="flex flex-wrap gap-2">
                      {level.assignedUsers.length > 0 ? (
                        level.assignedUsers.map(userId => {
                          const user = users.find(u => u.id === userId);
                          return (
                            <div key={userId} className="bg-gray-100 rounded-full px-3 py-1 text-xs">
                              {user?.name || `User ${userId}`}
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-sm text-gray-500">No users assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog for adding a new level */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Pipeline Level</DialogTitle>
            <DialogDescription>
              Create a new level in the hiring pipeline for this job.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddLevel)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Resume Screening" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the purpose of this pipeline level" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assignedUsers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Users (Optional)</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value?.join(",")}
                        onValueChange={(value) => field.onChange(value ? value.split(",") : [])}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select users to assign" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-ats-600 hover:bg-ats-700">
                  Add Level
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for editing a level */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pipeline Level</DialogTitle>
            <DialogDescription>
              Update this level in the hiring pipeline.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditLevel)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assignedUsers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Users (Optional)</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value?.join(",")}
                        onValueChange={(value) => field.onChange(value ? value.split(",") : [])}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select users to assign" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingLevel(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-ats-600 hover:bg-ats-700">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
