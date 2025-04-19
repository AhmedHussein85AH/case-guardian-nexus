
import AppShell from "@/components/layouts/AppShell";
import CasesList from "@/components/cases/CasesList";
import { getAllCases } from "@/services/dataService";
import { useEffect, useState } from "react";
import { Case } from "@/types/case";

const CasesPage = () => {
  const [cases, setCases] = useState<Case[]>([]);
  
  useEffect(() => {
    const loadCases = () => {
      const allCases = getAllCases();
      setCases(allCases);
    };
    
    loadCases();
    
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "case-guardian-cases") {
        loadCases();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Cases Management</h1>
        <p className="text-muted-foreground">
          View and manage all your security cases.
        </p>
        <CasesList cases={cases} />
      </div>
    </AppShell>
  );
};

export default CasesPage;
