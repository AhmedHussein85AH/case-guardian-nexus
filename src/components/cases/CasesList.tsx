import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Case, CasePriority, CaseStatus, CaseType } from "@/types/case";
import { caseTypes, getRecentCases, priorities, statuses } from "@/data/mockCases";
import { Calendar, Filter, PlusCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface CasesListProps {
  cases?: Case[];
  showCreateButton?: boolean;
  showFilters?: boolean;
  showPagination?: boolean;
  title?: string;
  description?: string;
}

const CasesList = ({ 
  cases, 
  showCreateButton = true, 
  showFilters = true,
  showPagination = true,
  title = "All Cases",
  description
}: CasesListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const navigate = useNavigate();
  
  // Use provided cases or fallback to recent cases
  const allCases = cases || getRecentCases(20);

  // Apply filters and search, then sort by creation date
  const filteredCases = allCases
    .filter(caseItem => {
      const matchesSearch = 
        searchTerm === "" ||
        caseItem.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === "" || caseItem.caseType === filterType;
      const matchesPriority = filterPriority === "" || caseItem.priority === filterPriority;
      const matchesStatus = filterStatus === "" || caseItem.status === filterStatus;
      
      return matchesSearch && matchesType && matchesPriority && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderPriorityBadge = (priority: CasePriority) => {
    return <span className={`case-priority-${priority}`}>{priority}</span>;
  };

  const renderStatusBadge = (status: CaseStatus) => {
    const label = status === 'inprogress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);
    return <span className={`case-status-${status}`}>{label}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {showCreateButton && (
            <Button onClick={() => navigate('/cases/new')} className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Case
            </Button>
          )}
        </div>
        
        {showFilters && (
          <div className="mt-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex flex-1 relative items-center">
                <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search cases..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("");
                    setFilterPriority("");
                    setFilterStatus("");
                  }}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-10 w-10"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select 
                value={filterType} 
                onValueChange={setFilterType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">All Types</SelectItem>
                  {caseTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={filterPriority} 
                onValueChange={setFilterPriority}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-priorities">All Priorities</SelectItem>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={filterStatus} 
                onValueChange={setFilterStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === 'inprogress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No cases found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases.map((caseItem) => (
                  <TableRow 
                    key={caseItem.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/cases/${caseItem.id}`)}
                  >
                    <TableCell className="font-medium">{caseItem.caseId}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {caseItem.caseType.charAt(0).toUpperCase() + caseItem.caseType.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{caseItem.description}</TableCell>
                    <TableCell>{formatDate(caseItem.incidentDate)}</TableCell>
                    <TableCell>{renderPriorityBadge(caseItem.priority)}</TableCell>
                    <TableCell>{renderStatusBadge(caseItem.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/cases/${caseItem.id}`);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {showPagination && filteredCases.length > 0 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CasesList;
