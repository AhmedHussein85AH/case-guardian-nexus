
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import AppShell from "@/components/layouts/AppShell";
import { CreateOrganizationDialog } from "@/components/organization/CreateOrganizationDialog";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const [showOrgPrompt, setShowOrgPrompt] = useState(false);
  
  useEffect(() => {
    // Check if user needs to create an organization
    if (user && !user.organization) {
      setShowOrgPrompt(true);
    } else {
      setShowOrgPrompt(false);
    }
  }, [user]);
  
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}
              {user?.organization && (
                <span className="ml-1">| Organization: {user.organization}</span>
              )}
            </p>
          </div>
          
          {showOrgPrompt && <CreateOrganizationDialog />}
        </div>
        
        <DashboardOverview />
      </div>
    </AppShell>
  );
};

export default Dashboard;
