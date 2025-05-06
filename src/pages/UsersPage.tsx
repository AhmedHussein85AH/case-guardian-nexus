
import React from "react";
import AppShell from "@/components/layouts/AppShell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UsersToolbar } from "@/components/users/UsersToolbar";
import { UsersTable } from "@/components/users/UsersTable";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";
import { useUsers } from "@/hooks/users"; // Updated import path
import { useAuth } from "@/hooks/auth";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, hasPermission } = useAuth();
  
  const {
    displayUsers,
    searchQuery,
    setSearchQuery,
    expandedUsers,
    toggleUserExpansion,
    editingUser,
    isEditDialogOpen,
    setIsEditDialogOpen,
    userToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleEditUser,
    handleDeleteUser,
    confirmDeleteUser,
    showToast,
    isLoading
  } = useUsers();

  // Check permissions
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    React.useEffect(() => {
      navigate('/login');
    }, [navigate]);
    return null;
  }

  const canViewUsers = hasPermission('viewUsers');
  const canManageUsers = hasPermission('manageUsers');

  if (!canViewUsers) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access the Users Management page.
            </AlertDescription>
          </Alert>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground mt-2">
              Manage system users and their permissions
            </p>
          </div>
          
          {canManageUsers && <AddUserDialog />}
        </div>
        
        <Card>
          <CardHeader>
            <UsersToolbar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </CardHeader>
          <CardContent>
            <UsersTable 
              users={displayUsers}
              expandedUsers={expandedUsers}
              onToggleExpand={toggleUserExpansion}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              onToast={showToast}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>

      {editingUser && (
        <EditUserDialog 
          user={editingUser} 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen} 
        />
      )}

      <DeleteUserDialog
        user={userToDelete}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteUser}
      />
    </AppShell>
  );
};

export default UsersPage;
