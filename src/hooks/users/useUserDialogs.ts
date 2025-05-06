
import { useState } from 'react';
import { User } from '@/components/users/UserTypes';
import { useToast } from "@/hooks/use-toast";
import { deleteUserProfile } from '@/services/user/userService';

export const useUserDialogs = () => {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      // Use the original UUID to delete the user
      const originalId = userToDelete.originalId || userToDelete.id.toString();
      
      // First, check if we're dealing with an admin user using the original UUID
      const { data: adminResult, error: adminError } = await supabase.rpc('is_admin_by_id', {
        user_id: originalId
      });
      
      // If it's an admin user and there's an error with the RPC call, fall back to direct deletion
      if (adminError) {
        console.log("Admin check failed, proceeding with direct deletion:", adminError);
      } else if (adminResult === true) {
        // This is an admin user, we might want to prevent deletion or show a special warning
        toast({
          title: "Cannot delete admin user",
          description: "Admin users cannot be deleted through the interface for security reasons.",
          variant: "destructive",
        });
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
        return;
      }
      
      // Delete the user profile
      await deleteUserProfile(originalId);
      
      toast({
        title: "User deleted",
        description: `${userToDelete.name} has been removed from the system.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to delete user",
        description: error.message || "An error occurred while deleting the user",
        variant: "destructive",
      });
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return {
    editingUser,
    isEditDialogOpen,
    setIsEditDialogOpen,
    userToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleEditUser,
    handleDeleteUser,
    confirmDeleteUser,
  };
};
