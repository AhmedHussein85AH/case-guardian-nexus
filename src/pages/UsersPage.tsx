
import React from "react";
import AppShell from "@/components/layouts/AppShell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UsersToolbar } from "@/components/users/UsersToolbar";
import { UsersTable } from "@/components/users/UsersTable";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";
import { useUsers } from "@/hooks/useUsers";

const UsersPage = () => {
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
    showToast
  } = useUsers();

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
          
          <AddUserDialog />
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
