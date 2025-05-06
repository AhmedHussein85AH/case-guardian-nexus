
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthUser, AuthContextType } from './types';
import { UserPermissions } from '@/components/users/UserTypes';

interface UseAuthMethodsProps {
  user: AuthUser | null;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthMethods = ({ user, setIsLoading }: UseAuthMethodsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) throw error;

      toast({
        title: "Login successful",
        description: "Welcome to Case Guardian Nexus",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login error",
        description: error.message || "Failed to log in. Please try again.",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: string = 'user') => {
    setIsLoading(true);
    try {
      // Split name into first and last name
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Signup successful",
        description: "Please check your email for a confirmation link",
      });
      
      // For development purposes, we can just login immediately
      // In production, users would need to confirm their email
      await login(email, password);
    } catch (error: any) {
      toast({
        title: "Signup error",
        description: error.message || "Failed to sign up. Please try again.",
        variant: "destructive",
      });
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/login');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Logout error",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions[permission] === true;
  };

  return {
    login,
    signup,
    logout,
    hasPermission
  };
};
