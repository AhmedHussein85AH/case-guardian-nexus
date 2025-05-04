
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { User } from "./UserTypes";
import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserActionsMenu } from "./UserActionsMenu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UserPermissionsView } from "./UserPermissionsView";

interface UserRowProps {
  user: User;
  isExpanded: boolean;
  onToggleExpand: (userId: number) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToast: (title: string, description: string) => void;
}

export function UserRow({ user, isExpanded, onToggleExpand, onEdit, onDelete, onToast }: UserRowProps) {
  return (
    <Collapsible open={isExpanded}>
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
        <TableCell><UserRoleBadge role={user.role} /></TableCell>
        <TableCell>{user.department}</TableCell>
        <TableCell><UserStatusBadge status={user.status} /></TableCell>
        <TableCell>
          <CollapsibleTrigger
            asChild
            onClick={() => onToggleExpand(user.id)}
          >
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              View
            </Button>
          </CollapsibleTrigger>
        </TableCell>
        <TableCell>
          <UserActionsMenu 
            user={user} 
            onEdit={onEdit} 
            onDelete={onDelete}
            onToast={onToast}
          />
        </TableCell>
      </TableRow>
      <CollapsibleContent>
        <TableRow className="bg-muted/50">
          <TableCell colSpan={7}>
            <UserPermissionsView permissions={user.permissions} />
          </TableCell>
        </TableRow>
      </CollapsibleContent>
    </Collapsible>
  );
}
