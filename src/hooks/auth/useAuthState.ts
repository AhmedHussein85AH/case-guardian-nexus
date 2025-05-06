
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthUser } from './types';

export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  // Initialize auth state and set up listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        
        if (session) {
          // We have a session, let's check if we need to fetch user profile
          if (!user || user.id !== session.user.id) {
            // Use setTimeout to prevent potential deadlocks with Supabase client
            setTimeout(() => {
              fetchUserProfile(session.user.id);
            }, 0);
          }
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      setSession(session);
      
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Fetch user profile from our public.user_profiles table
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }

      if (data) {
        // Create default permissions in case they're not set
        const defaultPermissions = {
          viewCases: true,
          manageCases: false,
          viewReports: false,
          generateReports: false,
          viewUsers: false,
          manageUsers: false,
          viewMessages: true,
          manageSettings: false,
        };

        // Handle permissions - make sure we have a proper UserPermissions object
        let userPermissions;
        
        if (data.permissions && typeof data.permissions === 'object') {
          // Merge default with stored permissions to ensure all fields exist
          userPermissions = {
            ...defaultPermissions,
            ...data.permissions
          };
        } else {
          // Use defaults if permissions are missing or invalid
          userPermissions = defaultPermissions;
        }

        // Create the auth user object with properly typed permissions
        const authUser: AuthUser = {
          id: userId,
          email: data.email,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.email,
          role: data.role || 'user',
          permissions: userPermissions
        };

        setUser(authUser);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast({
        title: "Error loading profile",
        description: "Please try logging in again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    session,
    setSession,
    fetchUserProfile
  };
};
