
import { Layout } from "@/components/layout/Layout";
import { RolePermissionsTable } from "@/components/users/RolePermissionsTable";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const RolePermissionsPage = () => {
  // Get the rolePermissions from AuthContext
  const { rolePermissions } = useAuth();

  return (
    <Layout title="Role Permissions">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Role Permissions</h1>
          <p className="text-muted-foreground">
            Review and understand the permissions assigned to each role
          </p>
        </div>

        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Admin only area</AlertTitle>
          <AlertDescription>
            These permissions are system-defined and require code changes to modify
          </AlertDescription>
        </Alert>

        <RolePermissionsTable rolePermissions={rolePermissions} />
      </div>
    </Layout>
  );
};

export default RolePermissionsPage;
