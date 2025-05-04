
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "./UserTypes";
import { UserRow } from "./UserRow";

interface UsersTableProps {
  users: User[];
  expandedUsers: { [key: number]: boolean };
  onToggleExpand: (userId: number) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onToast: (title: string, description: string) => void;
}

export function UsersTable({ 
  users, 
  expandedUsers, 
  onToggleExpand,
  onEditUser, 
  onDeleteUser,
  onToast
}: UsersTableProps) {
  return (
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
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isExpanded={!!expandedUsers[user.id]}
              onToggleExpand={onToggleExpand}
              onEdit={onEditUser}
              onDelete={onDeleteUser}
              onToast={onToast}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
