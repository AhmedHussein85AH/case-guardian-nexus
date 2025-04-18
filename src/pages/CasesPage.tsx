
import AppShell from "@/components/layouts/AppShell";
import CasesList from "@/components/cases/CasesList";
import { mockCases } from "@/data/mockCases";

const CasesPage = () => {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Cases Management</h1>
        <p className="text-muted-foreground">
          View and manage all your security cases.
        </p>
        <CasesList cases={mockCases} />
      </div>
    </AppShell>
  );
};

export default CasesPage;
