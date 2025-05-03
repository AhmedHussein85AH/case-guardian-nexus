
import { useState, useEffect } from "react";
import AppShell from "@/components/layouts/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Filter, Search, MoreHorizontal, Trash, Shield, CheckCircle, XCircle } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type UserPermissions = {
  viewCases: boolean;
  manageCases: boolean;
  viewReports: boolean;
  generateReports: boolean;
  viewUsers: boolean;
  manageUsers: boolean;
  viewMessages: boolean;
  manageSettings: boolean;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  initials: string;
  permissions?: UserPermissions;
};

const UsersPage = () => {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [displayUsers, setDisplayUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUsers, setExpandedUsers] = useState<{ [key: number]: boolean }>({});
  const { toast } = useToast();

  // Initial mock user data
  const mockUsers = [
    {
      id: 1,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Admin",
      department: "Admins",
      status: "Active",
      initials: "JS",
      permissions: {
        viewCases: true,
        manageCases: true,
        viewReports: true,
        generateReports: true,
        viewUsers: true,
        manageUsers: true,
        viewMessages: true,
        manageSettings: true,
      }
    },
    {
      id: 2,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "Manager",
      department: "Managers",
      status: "Active",
      initials: "RJ",
      permissions: {
        viewCases: true,
        manageCases: true,
        viewReports: true,
        generateReports: true,
        viewUsers: true,
        manageUsers: false,
        viewMessages: true,
        manageSettings: false,
      }
    },
    {
      id: 3,
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      role: "CCTV Operator",
      department: "Operators",
      status: "Away",
      initials: "SW",
      permissions: {
        viewCases: true,
        manageCases: false,
        viewReports: false,
        generateReports: false,
        viewUsers: false,
        manageUsers: false,
        viewMessages: true,
        manageSettings: false,
      }
    },
    {
      id: 4,
      name: "Michael Davis",
      email: "michael.davis@example.com",
      role: "Manager",
      department: "Managers",
      status: "Active",
      initials: "MD",
      permissions: {
        viewCases: true,
        manageCases: true,
        viewReports: true,
        generateReports: false,
        viewUsers: false,
        manageUsers: false,
        viewMessages: true,
        manageSettings: false,
      }
    },
    {
      id: 5,
      name: "Lisa Brown",
      email: "lisa.brown@example.com",
      role: "CCTV Operator",
      department: "Operators",
      status: "Inactive",
      initials: "LB",
      permissions: {
        viewCases: true,
        manageCases: false,
        viewReports: false,
        generateReports: false,
        viewUsers: false,
        manageUsers: false,
        viewMessages: true,
        manageSettings: false,
      }
    },
  ];

  // Load users from localStorage or use mock data
  useEffect(() => {
    const loadUsers = () => {
      let storedUsers = localStorage.getItem('case-guardian-users');
      if (!storedUsers) {
        // Initialize with mock data if no data exists
        localStorage.setItem('case-guardian-users', JSON.stringify(mockUsers));
        setAllUsers(mockUsers);
        setDisplayUsers(mockUsers);
      } else {
        const parsedUsers = JSON.parse(storedUsers);
        setAllUsers(parsedUsers);
        setDisplayUsers(parsedUsers);
      }
    };

    loadUsers();

    const handleStorageChange = () => {
      loadUsers();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setDisplayUsers(allUsers);
    } else {
      const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayUsers(filteredUsers);
    }
  }, [searchQuery, allUsers]);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    
    const updatedUsers = allUsers.filter(user => user.id !== userToDelete.id);
    localStorage.setItem('case-guardian-users', JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);
    setDisplayUsers(updatedUsers.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
    ));
    
    toast({
      title: "User deleted",
      description: `${userToDelete.name} has been removed from the system.`,
    });
    
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const toggleUserExpansion = (userId: number) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case "Away":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Away</Badge>;
      case "Inactive":
        return <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Admin</Badge>;
      case "Manager":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Manager</Badge>;
      case "CCTV Operator":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">CCTV Operator</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getPermissionIcon = (hasPermission: boolean) => {
    return hasPermission ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground mt-2">
              Manage system users and their permissions
            </p>
          </div>
          
          <AddUserDialog />
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <CardTitle>System Users</CardTitle>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users..." 
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayUsers.map((user) => (
                    <React.Fragment key={user.id}>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{user.initials}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <CollapsibleTrigger
                            asChild
                            onClick={() => toggleUserExpansion(user.id)}
                          >
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Shield className="h-4 w-4" />
                              View
                            </Button>
                          </CollapsibleTrigger>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => toast({ title: "Profile view", description: "Viewing " + user.name + "'s profile" })}>
                                View profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                Edit user
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast({ title: "Password reset", description: "Password reset email sent to " + user.email })}>
                                Reset password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete user
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <Collapsible open={expandedUsers[user.id]}>
                        <CollapsibleContent>
                          <TableRow className="bg-muted/50">
                            <TableCell colSpan={7}>
                              <div className="py-2 px-4">
                                <h4 className="font-medium mb-2">User Permissions</h4>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                  <div className="flex items-center gap-2">
                                    {getPermissionIcon(user.permissions?.viewCases ?? false)}
                                    <span>View Cases</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getPermissionIcon(user.permissions?.manageCases ?? false)}
                                    <span>Manage Cases</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getPermissionIcon(user.permissions?.viewReports ?? false)}
                                    <span>View Reports</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getPermissionIcon(user.permissions?.generateReports ?? false)}
                                    <span>Generate Reports</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getPermissionIcon(user.permissions?.viewUsers ?? false)}
                                    <span>View Users</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getPermissionIcon(user.permissions?.manageUsers ?? false)}
                                    <span>Manage Users</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getPermissionIcon(user.permissions?.viewMessages ?? false)}
                                    <span>View Messages</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getPermissionIcon(user.permissions?.manageSettings ?? false)}
                                    <span>Manage Settings</span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        </CollapsibleContent>
                      </Collapsible>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {editingUser && (
        <EditUserDialog 
          user={editingUser} 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen} 
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user 
              {userToDelete && ` "${userToDelete.name}"`} and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
};

export default UsersPage;
