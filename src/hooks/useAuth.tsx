
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { UserPermissions } from '@/components/users/UserTypes';
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  role: string;
  name: string;
  organization?: string;
  permissions?: UserPermissions;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: keyof UserPermissions) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize user session from Supabase
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
        const authUser: AuthUser = {
          id: userId,
          email: data.email,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.email,
          role: data.role || 'user',
          permissions: data.permissions || {
            viewCases: true,
            manageCases: false,
            viewReports: false,
            generateReports: false,
            viewUsers: false,
            manageUsers: false,
            viewMessages: true,
            manageSettings: false,
          }
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
      
      setUser(null);
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login,
      signup,
      logout,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
