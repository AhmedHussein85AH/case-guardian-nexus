
import AppShell from "@/components/layouts/AppShell";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

const Dashboard = () => {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your case management dashboard.
        </p>
        <DashboardOverview />
      </div>
    </AppShell>
  );
};

export default Dashboard;
