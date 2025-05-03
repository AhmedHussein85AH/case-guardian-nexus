
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";

interface UsersToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function UsersToolbar({ searchQuery, onSearchChange }: UsersToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
      <h2 className="text-lg font-semibold">System Users</h2>
      
      <div className="flex gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-8 w-[250px]"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Button variant="outline" size="icon" className="h-10 w-10">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
