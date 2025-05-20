
import React, { useState, useEffect } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface EditRoleDialogProps {
  roleId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Role name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

// Define available modules
const modules = [
  { id: "recruitment", name: "Recruitment" },
  { id: "candidates", name: "Candidates" },
  { id: "jobs", name: "Jobs" },
  { id: "users", name: "Users" },
  { id: "settings", name: "Settings" },
  { id: "reports", name: "Reports" },
  { id: "workflow", name: "Workflow" }
];

// Define permission types
const permissionTypes = ["create", "read", "update", "delete"];

// Mock role data
const mockRoles = {
  '1': {
    name: 'Admin',
    description: 'Full system access',
    permissions: {
      recruitment: { create: true, read: true, update: true, delete: true },
      candidates: { create: true, read: true, update: true, delete: true },
      jobs: { create: true, read: true, update: true, delete: true },
      users: { create: true, read: true, update: true, delete: true },
      settings: { create: true, read: true, update: true, delete: true },
      reports: { create: true, read: true, update: true, delete: true },
      workflow: { create: true, read: true, update: true, delete: true }
    }
  },
  '2': {
    name: 'Recruiter',
    description: 'Can manage candidates and jobs',
    permissions: {
      recruitment: { create: true, read: true, update: true, delete: false },
      candidates: { create: true, read: true, update: true, delete: false },
      jobs: { create: true, read: true, update: true, delete: false },
      users: { create: false, read: true, update: false, delete: false },
      settings: { create: false, read: true, update: false, delete: false },
      reports: { create: false, read: true, update: false, delete: false },
      workflow: { create: true, read: true, update: true, delete: false }
    }
  },
  '3': {
    name: 'Hiring Manager',
    description: 'Limited access to review candidates',
    permissions: {
      recruitment: { create: false, read: true, update: true, delete: false },
      candidates: { create: false, read: true, update: true, delete: false },
      jobs: { create: false, read: true, update: true, delete: false },
      users: { create: false, read: true, update: false, delete: false },
      settings: { create: false, read: false, update: false, delete: false },
      reports: { create: false, read: true, update: false, delete: false },
      workflow: { create: false, read: true, update: true, delete: false }
    }
  },
  '4': {
    name: 'Viewer',
    description: 'Read-only access to the system',
    permissions: {
      recruitment: { create: false, read: true, update: false, delete: false },
      candidates: { create: false, read: true, update: false, delete: false },
      jobs: { create: false, read: true, update: false, delete: false },
      users: { create: false, read: true, update: false, delete: false },
      settings: { create: false, read: true, update: false, delete: false },
      reports: { create: false, read: true, update: false, delete: false },
      workflow: { create: false, read: true, update: false, delete: false }
    }
  }
};

export const EditRoleDialog: React.FC<EditRoleDialogProps> = ({ 
  roleId,
  open, 
  onOpenChange 
}) => {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  
  useEffect(() => {
    // In a real app, you would fetch role data from an API
    if (roleId && mockRoles[roleId as keyof typeof mockRoles]) {
      const role = mockRoles[roleId as keyof typeof mockRoles];
      form.reset({
        name: role.name,
        description: role.description,
      });
      setPermissions(role.permissions);
    }
  }, [roleId, form]);
  
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
    // In a real app, you would call an API to update the role
    console.log("Form submitted:", values);
    console.log("Role permissions:", permissions);
    
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
          <DialogDescription>
            Update role details and permissions.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Admin, Recruiter, etc." {...field} />
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
                      <Input placeholder="Brief description of this role's purpose" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Permissions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Assign permissions for this role. Users with this role will have access to the selected actions.
              </p>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Module</TableHead>
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
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
