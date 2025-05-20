
import { useState } from 'react';
import { Layout } from "@/components/layout/Layout";
import { RBACWrapper } from "@/components/layout/RBACWrapper";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { UserTable } from "@/components/users/UserTable";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const UserManagement = () => {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const { users } = useAuth();
  const { toast } = useToast();

  const handleDeleteUser = (userId: string) => {
    // In a real implementation, you would call an API to delete the user
    toast({
      title: "User deleted",
      description: "The user has been successfully deleted.",
    });
  };

  const handleEditUser = (userId: string) => {
    // In a real implementation, this would open a dialog to edit the user
    toast({
      title: "Edit user",
      description: "The edit user dialog would open here.",
    });
  };

  return (
    <Layout title="User Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts and their roles
            </p>
          </div>
          <RBACWrapper requiredPermission={{ action: 'create', subject: 'users' }}>
            <Button onClick={() => setIsAddUserDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </RBACWrapper>
        </div>

        <Card>
          <CardContent className="pt-6">
            <UserTable 
              users={users} 
              onEdit={handleEditUser} 
              onDelete={handleDeleteUser} 
            />
          </CardContent>
        </Card>
        
        <AddUserDialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen} />
      </div>
    </Layout>
  );
};

export default UserManagement;
