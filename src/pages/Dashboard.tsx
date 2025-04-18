
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import AppShell from "@/components/layouts/AppShell";
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
              {user?.organization && (
                <span className="ml-1">| Organization: {user.organization}</span>
              )}
            </p>
          </div>
        </div>
        
        <DashboardOverview />
      </div>
    </AppShell>
  );
};

export default Dashboard;
