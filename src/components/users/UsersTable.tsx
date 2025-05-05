
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "./UserTypes";
import { UserRow } from "./UserRow";
import { Skeleton } from "@/components/ui/skeleton";

interface UsersTableProps {
  users: User[];
  expandedUsers: { [key: number]: boolean };
  onToggleExpand: (userId: number) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onToast: (title: string, description: string) => void;
  isLoading?: boolean;
}

export function UsersTable({ 
  users, 
  expandedUsers, 
  onToggleExpand,
  onEditUser, 
  onDeleteUser,
  onToast,
  isLoading = false
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border overflow-hidden">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">Name</TableHead>
              <TableHead className="w-[25%]">Email</TableHead>
              <TableHead className="w-[12%]">Role</TableHead>
              <TableHead className="w-[12%]">Department</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[10%]">Permissions</TableHead>
              <TableHead className="w-[6%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableHead><Skeleton className="h-8 w-48" /></TableHead>
                <TableHead><Skeleton className="h-8 w-40" /></TableHead>
                <TableHead><Skeleton className="h-8 w-24" /></TableHead>
                <TableHead><Skeleton className="h-8 w-24" /></TableHead>
                <TableHead><Skeleton className="h-8 w-24" /></TableHead>
                <TableHead><Skeleton className="h-8 w-24" /></TableHead>
                <TableHead><Skeleton className="h-8 w-16" /></TableHead>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%]">Name</TableHead>
            <TableHead className="w-[25%]">Email</TableHead>
            <TableHead className="w-[12%]">Role</TableHead>
            <TableHead className="w-[12%]">Department</TableHead>
            <TableHead className="w-[10%]">Status</TableHead>
            <TableHead className="w-[10%]">Permissions</TableHead>
            <TableHead className="w-[6%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableHead colSpan={7} className="text-center py-8 text-muted-foreground">
                No users found
              </TableHead>
            </TableRow>
          ) : (
            users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                isExpanded={!!expandedUsers[user.id]}
                onToggleExpand={onToggleExpand}
                onEdit={onEditUser}
                onDelete={onDeleteUser}
                onToast={onToast}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
