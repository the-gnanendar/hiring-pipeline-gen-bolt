
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Role } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface UserRoleSelectProps {
  userId: string;
  currentRole: Role;
  disabled?: boolean;
}

export const UserRoleSelect: React.FC<UserRoleSelectProps> = ({ 
  userId, 
  currentRole, 
  disabled = false 
}) => {
  const { toast } = useToast();
  
  const handleRoleChange = (newRole: Role) => {
    // In a real app, you would call an API to update the user's role
    console.log(`Changing user ${userId} role to ${newRole}`);
    
    toast({
      title: "Role updated",
      description: `User role has been updated to ${newRole.replace('_', ' ')}`,
    });
  };
  
  return (
    <Select defaultValue={currentRole} onValueChange={handleRoleChange as any} disabled={disabled}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="recruiter">Recruiter</SelectItem>
        <SelectItem value="hiring_manager">Hiring Manager</SelectItem>
        <SelectItem value="viewer">Viewer</SelectItem>
      </SelectContent>
    </Select>
  );
};
