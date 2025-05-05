
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash, User, Lock } from "lucide-react";
import { User as UserType } from "./UserTypes";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface UserActionsMenuProps {
  user: UserType;
  onEdit: (user: UserType) => void;
  onDelete: (user: UserType) => void;
  onToast: (title: string, description: string) => void;
}

export function UserActionsMenu({ user, onEdit, onDelete, onToast }: UserActionsMenuProps) {
  const [isResetting, setIsResetting] = useState(false);

  // View profile handler
  const handleViewProfile = () => {
    // Show toast with user details
    onToast(
      `${user.name}'s Profile`, 
      `Email: ${user.email}\nRole: ${user.role}\nDepartment: ${user.department}`
    );
  };

  // Reset password handler
  const handleResetPassword = async () => {
    try {
      setIsResetting(true);
      
      // Send password recovery email via Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      onToast(
        "Password reset email sent", 
        `A password reset link has been sent to ${user.email}`
      );
    } catch (error: any) {
      onToast(
        "Error sending reset email", 
        error.message || "Failed to send password reset email"
      );
      console.error("Password reset error:", error);
    } finally {
      setIsResetting(false);
    }
  };

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
        <DropdownMenuItem onClick={handleViewProfile}>
          <User className="h-4 w-4 mr-2" />
          View profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(user)}>
          Edit user
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleResetPassword}
          disabled={isResetting}
        >
          <Lock className="h-4 w-4 mr-2" />
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
