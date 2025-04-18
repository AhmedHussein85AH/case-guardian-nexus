
import AppShell from "@/components/layouts/AppShell";
import CaseForm from "@/components/cases/CaseForm";

const NewCasePage = () => {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Create New Case</h1>
        <p className="text-muted-foreground">
          Submit a new security case for review and tracking.
        </p>
        <CaseForm />
      </div>
    </AppShell>
  );
};

export default NewCasePage;
