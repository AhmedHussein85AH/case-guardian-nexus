
import AppShell from "@/components/layouts/AppShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import CasesList from "@/components/cases/CasesList";
import { Case } from "@/types/case";
import { getAllCases } from "@/services/dataService";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Case[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [allCases, setAllCases] = useState<Case[]>([]);

  useEffect(() => {
    // Load all cases from local storage
    setAllCases(getAllCases());
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "case-guardian-cases") {
        setAllCases(getAllCases());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSearch = () => {
    // Filter cases based on the search term
    const results = allCases.filter((caseItem) => {
      const term = searchTerm.toLowerCase();
      return (
        caseItem.caseId.toLowerCase().includes(term) ||
        caseItem.description.toLowerCase().includes(term) ||
        caseItem.location.toLowerCase().includes(term) ||
        caseItem.caseType.toLowerCase().includes(term)
      );
    });
    
    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Cases</h1>
          <p className="text-muted-foreground mt-2">
            Find case files by ID, description, location, or type
          </p>
        </div>

        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for cases..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {hasSearched && (
          <CasesList 
            cases={searchResults}
            title={`Search Results (${searchResults.length})`}
            description={searchResults.length === 0 
              ? "No cases match your search criteria. Try a different search term." 
              : `Showing ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchTerm}"`
            }
            showCreateButton={false}
            showFilters={false}
          />
        )}
      </div>
    </AppShell>
  );
};

export default SearchPage;
