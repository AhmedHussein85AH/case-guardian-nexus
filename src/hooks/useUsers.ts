
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { User, UserPermissions } from '@/components/users/UserTypes';
import { supabase } from "@/integrations/supabase/client";

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
          const formattedUsers: User[] = data.map(user => ({
            id: parseInt(user.id.slice(0, 8), 16), // Convert UUID to numeric ID for compatibility
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
            email: user.email,
            role: user.role || 'User',
            department: user.department || 'General',
            status: user.status || 'Active',
            initials: getInitials(`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email),
            permissions: user.permissions as UserPermissions || {
              viewCases: true,
              manageCases: false,
              viewReports: false,
              generateReports: false,
              viewUsers: false,
              manageUsers: false,
              viewMessages: true,
              manageSettings: false,
            },
          }));

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
      // We delete the auth user, which will cascade to the profile due to our foreign key constraint
      const { error } = await supabase.auth.admin.deleteUser(userToDelete.id.toString());
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "User deleted",
        description: `${userToDelete.name} has been removed from the system.`,
      });
      
      // Update local state - this should be handled by the subscription, but just in case
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
