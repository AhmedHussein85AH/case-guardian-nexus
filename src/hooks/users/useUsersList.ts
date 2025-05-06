
import { useState, useEffect } from 'react';
import { User } from '@/components/users/UserTypes';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getAllUserProfiles } from '@/services/user/userService';

export const useUsersList = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [displayUsers, setDisplayUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load users from Supabase
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const users = await getAllUserProfiles();
        setAllUsers(users);
        setDisplayUsers(users);
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

  return {
    allUsers,
    displayUsers,
    searchQuery,
    setSearchQuery,
    isLoading,
  };
};
