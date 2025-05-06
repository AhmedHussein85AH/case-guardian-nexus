import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { User, UserPermissions } from '@/components/users/UserTypes';
import { supabase } from "@/integrations/supabase/client";
import { getInitials } from '@/services/user/userService';

export const useUsers = () => {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [displayUsers, setDisplayUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUsers, setExpandedUsers] = useState<{ [key: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load users from Supabase
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          const formattedUsers: User[] = data.map(user => {
            // Generate a numeric ID from the UUID for compatibility
            const numericId = parseInt(user.id.replace(/-/g, '').substring(0, 8), 16);
            
            const firstName = user.first_name || '';
            const lastName = user.last_name || '';
            const fullName = `${firstName} ${lastName}`.trim() || user.email;
            
            // Get initials from name
            const initials = getInitials(fullName);
            
            // Default permissions if none exist
            const defaultPermissions: UserPermissions = {
              viewCases: true,
              manageCases: false,
              viewReports: false,
              generateReports: false,
              viewUsers: false,
              manageUsers: false,
              viewMessages: true,
              manageSettings: false,
            };
            
            // Ensure permissions is properly typed
            let userPermissions: UserPermissions;
            
            if (user.permissions && typeof user.permissions === 'object') {
              userPermissions = {
                ...defaultPermissions,
                ...(user.permissions as unknown as UserPermissions)
              };
            } else {
              userPermissions = defaultPermissions;
            }
            
            return {
              id: numericId,
              name: fullName,
              email: user.email,
              role: user.role || 'User',
              department: user.department || 'General',
              status: user.status || 'Active',
              initials: initials,
              permissions: userPermissions,
              originalId: user.id, // Keep the original UUID for API operations
            };
          });

          setAllUsers(formattedUsers);
          setDisplayUsers(formattedUsers);
        }
      } catch (error: any) {
        toast({
          title: "Failed to load users",
          description: error.message || "An error occurred while loading users",
          variant: "destructive",
        });
        console.error("Error loading users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();

    // Subscribe to changes in the user_profiles table
    const usersSubscription = supabase
      .channel('public:user_profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, loadUsers)
      .subscribe();

    return () => {
      supabase.removeChannel(usersSubscription);
    };
  }, [toast]);

  // Get initials from a name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setDisplayUsers(allUsers);
    } else {
      const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayUsers(filteredUsers);
    }
  }, [searchQuery, allUsers]);

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
      
      // Delete the user profile first
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', originalId);
      
      if (profileError) {
        throw profileError;
      }
      
      toast({
        title: "User deleted",
        description: `${userToDelete.name} has been removed from the system.`,
      });
      
      // Update local state
      setAllUsers(users => users.filter(user => user.id !== userToDelete.id));
      setDisplayUsers(users => users.filter(user => user.id !== userToDelete.id));
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

  const toggleUserExpansion = (userId: number) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const showToast = (title: string, description: string) => {
    toast({ title, description });
  };

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
