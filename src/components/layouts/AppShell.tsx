
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import AppSidebar from "@/components/navigation/AppSidebar";
import AppHeader from "@/components/navigation/AppHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AppShellProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const AppShell = ({ children, requireAuth = true }: AppShellProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse-gentle">
          <div className="h-12 w-12 rounded-full bg-primary/30"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If we don't require authentication or user is authenticated, render the layout
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-[auto_1fr]">
        <AppSidebar />
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppShell;
