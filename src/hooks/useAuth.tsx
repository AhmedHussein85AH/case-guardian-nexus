
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

type UserPermissions = {
  viewCases: boolean;
  manageCases: boolean;
  viewReports: boolean;
  generateReports: boolean;
  viewUsers: boolean;
  manageUsers: boolean;
  viewMessages: boolean;
  manageSettings: boolean;
};

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  organization?: string;
  permissions?: UserPermissions;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: keyof UserPermissions) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('caseGuardianUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a mock login - in a real app, we'd make an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation for demo purposes
      if (email === "admin@example.com" && password === "password") {
        const user = {
          id: "1",
          email,
          role: "Admin",
          name: "Admin User",
          permissions: {
            viewCases: true,
            manageCases: true,
            viewReports: true,
            generateReports: true,
            viewUsers: true,
            manageUsers: true,
            viewMessages: true,
            manageSettings: true,
          }
        };
        
        localStorage.setItem("caseGuardianUser", JSON.stringify(user));
        setUser(user);
        
        toast({
          title: "Login successful",
          description: "Welcome to Case Guardian Nexus",
        });
        
        navigate("/dashboard");
      } else {
        // Allow any email/password combination for testing
        const user = {
          id: Math.random().toString(36).substring(2, 9),
          email,
          role: "CCTV Operator",
          name: email.split('@')[0],
          permissions: {
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
        
        localStorage.setItem("caseGuardianUser", JSON.stringify(user));
        setUser(user);
        
        toast({
          title: "Login successful",
          description: "Welcome to Case Guardian Nexus",
        });
        
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "Failed to log in. Please try again.",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('caseGuardianUser');
    setUser(null);
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
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
