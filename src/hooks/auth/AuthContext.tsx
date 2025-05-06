
import { createContext, useContext, ReactNode } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { 
    user, 
    isLoading, 
    setIsLoading 
  } = useAuthState();
  
  const { 
    login, 
    signup, 
    logout, 
    hasPermission 
  } = useAuthMethods({ 
    user, 
    setIsLoading 
  });

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
