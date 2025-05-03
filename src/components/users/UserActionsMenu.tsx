
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import { User } from "./UserTypes";

interface UserActionsMenuProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToast: (title: string, description: string) => void;
}

export function UserActionsMenu({ user, onEdit, onDelete, onToast }: UserActionsMenuProps) {
  return (
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
        <DropdownMenuItem onClick={() => onToast("Profile view", "Viewing " + user.name + "'s profile")}>
          View profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(user)}>
          Edit user
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToast("Password reset", "Password reset email sent to " + user.email)}>
          Reset password
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive"
          onClick={() => onDelete(user)}
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
