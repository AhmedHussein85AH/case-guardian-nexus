
import { useState } from 'react';
import { User } from '@/components/users/UserTypes';
import { deleteUserProfile } from '@/services/user/userService';
import { supabase } from "@/integrations/supabase/client";

export const useUserDialogs = () => {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

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
      // Convert id to string if it's a number to fix type error
      await deleteUserProfile(userToDelete.id.toString());
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
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
    confirmDeleteUser
  };
};
