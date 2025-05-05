
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { EditUserForm } from "./EditUserForm";
import { User } from "./UserTypes";
import { EditUserFormValues } from "./editUserSchema";
import { supabase } from "@/integrations/supabase/client";

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const { toast } = useToast();
  
  const onSubmit = async (values: EditUserFormValues) => {
    try {
      // Get the original UUID
      const originalId = user.originalId || user.id.toString();
      
      // Split name into first and last name
      const nameParts = values.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Update the user profile in Supabase
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          email: values.email,
          role: values.role,
          department: values.department,
          status: values.status,
          permissions: values.permissions
        })
        .eq('id', originalId);
      
      if (error) throw error;
      
      toast({
        title: "User updated successfully",
        description: `${values.name}'s information has been updated`,
      });
      
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error updating user",
        description: error.message || "Failed to update user information",
        variant: "destructive",
      });
      console.error("Error updating user:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the user details below.
          </DialogDescription>
        </DialogHeader>
        <EditUserForm 
          user={user}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
