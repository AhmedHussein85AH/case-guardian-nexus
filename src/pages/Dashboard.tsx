
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import AppShell from "@/components/layouts/AppShell";
import { CreateOrganizationDialog } from "@/components/organization/CreateOrganizationDialog";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}
            </p>
          </div>
          
          {!user?.organization && <CreateOrganizationDialog />}
        </div>
        
        <DashboardOverview />
      </div>
    </AppShell>
  );
};

export default Dashboard;
