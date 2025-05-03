
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { User } from '@/components/users/UserTypes';

export const useUsers = () => {
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

  const showToast = (title: string, description: string) => {
    toast({ title, description });
  };

  return {
    displayUsers,
    searchQuery,
    setSearchQuery,
    expandedUsers,
    toggleUserExpansion,
    editingUser,
    isEditDialogOpen,
    setIsEditDialogOpen,
    userToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleEditUser,
    handleDeleteUser,
    confirmDeleteUser,
    showToast
  };
};
