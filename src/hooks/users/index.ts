
import { supabase } from "@/integrations/supabase/client";
import { useUsersList } from './useUsersList';
import { useUserExpansion } from './useUserExpansion';
import { useUserDialogs } from './useUserDialogs';
import { useUserNotifications } from './useUserNotifications';

// Fix TypeScript error by adding import
import { User } from '@/components/users/UserTypes';

export const useUsers = () => {
  const {
    displayUsers,
    searchQuery,
    setSearchQuery,
    isLoading
  } = useUsersList();

  const {
    expandedUsers,
    toggleUserExpansion
  } = useUserExpansion();

  const {
    editingUser,
    isEditDialogOpen,
    setIsEditDialogOpen,
    userToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleEditUser,
    handleDeleteUser,
    confirmDeleteUser
  } = useUserDialogs();

  const {
    showToast
  } = useUserNotifications();

  return {
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
  };
};

// This re-export ensures backward compatibility
export * from './useUsersList';
export * from './useUserExpansion';
export * from './useUserDialogs';
export * from './useUserNotifications';
