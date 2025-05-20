
import { useState } from 'react';
import { Layout } from "@/components/layout/Layout";
import { RBACWrapper } from "@/components/layout/RBACWrapper";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const RoleManagement = () => {
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState<string | null>(null);
  const { rolePermissions } = useAuth();
  const { toast } = useToast();

  // Sample roles for demonstration
  const roles = [
    { id: '1', name: 'Admin', description: 'Full system access' },
    { id: '2', name: 'Recruiter', description: 'Can manage candidates and jobs' },
    { id: '3', name: 'Hiring Manager', description: 'Limited access to review candidates' },
    { id: '4', name: 'Viewer', description: 'Read-only access to the system' },
  ];

  // Define available modules
  const modules = [
    { id: "recruitment", name: "Recruitment" },
    { id: "candidates", name: "Candidates" },
    { id: "jobs", name: "Jobs" },
    { id: "interviews", name: "Interviews" },
    { id: "users", name: "Users" },
    { id: "settings", name: "Settings" }
  ];

  // Define permission types
  const permissionTypes = ["create", "read", "update", "delete"];

  const handleAddRole = () => {
    setIsAddRoleDialogOpen(true);
  };

  const handleEditRole = (roleId: string) => {
    setCurrentRoleId(roleId);
    setIsEditRoleDialogOpen(true);
  };

  const handleDeleteRole = (roleId: string) => {
    // In a real implementation, you would call an API to delete the role
    toast({
      title: "Role deleted",
      description: "The role has been successfully deleted.",
    });
  };

  // Add role form schema
  const formSchema = z.object({
    name: z.string().min(2, { message: "Role name must be at least 2 characters." }),
    description: z.string().optional(),
  });

  const AddRoleDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        description: "",
      },
    });
    
    const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});
    
    const togglePermission = (module: string, permission: string) => {
      setPermissions(prev => ({
        ...prev,
        [module]: {
          ...prev[module],
          [permission]: !prev[module]?.[permission]
        }
      }));
    };
    
    function onSubmit(values: z.infer<typeof formSchema>) {
      console.log("Role submitted:", values);
      console.log("Permissions:", permissions);
      
      toast({
        title: "Role created",
        description: `${values.name} role has been created successfully.`,
      });
      
      form.reset();
      setPermissions({});
      onOpenChange(false);
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>Create a new role and assign permissions</DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Admin, Manager, etc." {...field} />
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
                        <Input placeholder="Brief description of this role" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <Label>Role Permissions</Label>
                <div className="overflow-x-auto border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Module</TableHead>
                        {permissionTypes.map(permission => (
                          <TableHead key={permission} className="text-center capitalize">
                            {permission}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modules.map(module => (
                        <TableRow key={module.id}>
                          <TableCell className="font-medium">{module.name}</TableCell>
                          {permissionTypes.map(permission => (
                            <TableCell key={`${module.id}-${permission}`} className="text-center">
                              <Checkbox
                                checked={permissions[module.id]?.[permission] || false}
                                onCheckedChange={() => togglePermission(module.id, permission)}
                                className="mx-auto"
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-ats-600 hover:bg-ats-700"
                >
                  Create Role
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  };

  const EditRoleDialog = ({ 
    roleId, 
    open, 
    onOpenChange 
  }: { 
    roleId: string, 
    open: boolean, 
    onOpenChange: (open: boolean) => void 
  }) => {
    const role = roles.find(r => r.id === roleId);
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: role?.name || "",
        description: role?.description || "",
      },
    });
    
    // Initialize permissions based on role
    const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>(() => {
      // In a real app, you would fetch the actual permissions for this role
      const initialPerms: Record<string, Record<string, boolean>> = {};
      
      // For demo, set some default permissions based on role name
      modules.forEach(module => {
        initialPerms[module.id] = {
          create: role?.name === "Admin" || role?.name === "Recruiter",
          read: true, // Everyone can read
          update: role?.name === "Admin" || role?.name === "Recruiter",
          delete: role?.name === "Admin",
        };
      });
      
      return initialPerms;
    });
    
    const togglePermission = (module: string, permission: string) => {
      setPermissions(prev => ({
        ...prev,
        [module]: {
          ...prev[module],
          [permission]: !prev[module]?.[permission]
        }
      }));
    };
    
    function onSubmit(values: z.infer<typeof formSchema>) {
      console.log("Role updated:", values);
      console.log("Updated permissions:", permissions);
      
      toast({
        title: "Role updated",
        description: `${values.name} role has been updated successfully.`,
      });
      
      onOpenChange(false);
    }
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update role information and permissions</DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Name</FormLabel>
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <Label>Role Permissions</Label>
                <div className="overflow-x-auto border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Module</TableHead>
                        {permissionTypes.map(permission => (
                          <TableHead key={permission} className="text-center capitalize">
                            {permission}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modules.map(module => (
                        <TableRow key={module.id}>
                          <TableCell className="font-medium">{module.name}</TableCell>
                          {permissionTypes.map(permission => (
                            <TableCell key={`${module.id}-${permission}`} className="text-center">
                              <Checkbox
                                checked={permissions[module.id]?.[permission] || false}
                                onCheckedChange={() => togglePermission(module.id, permission)}
                                className="mx-auto"
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-ats-600 hover:bg-ats-700"
                >
                  Update Role
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Layout title="Role Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Role Management</h1>
            <p className="text-muted-foreground">
              Define roles and assign permissions
            </p>
          </div>
          <RBACWrapper requiredPermission={{ action: 'create', subject: 'users' }}>
            <Button onClick={handleAddRole}>
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </RBACWrapper>
        </div>

        <Card>
          <CardContent className="pt-6 overflow-x-auto">
            <p className="text-sm text-muted-foreground mb-4">
              Create and manage roles with custom permission sets for different user types.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditRole(role.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit role</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete role</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <AddRoleDialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen} />
        {currentRoleId && (
          <EditRoleDialog 
            roleId={currentRoleId} 
            open={isEditRoleDialogOpen} 
            onOpenChange={setIsEditRoleDialogOpen} 
          />
        )}
      </div>
    </Layout>
  );
};

export default RoleManagement;
