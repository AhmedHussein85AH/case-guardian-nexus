
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { EditUserForm, User } from "./EditUserForm";
import { EditUserFormValues } from "./editUserSchema";

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const { toast } = useToast();
  
  const onSubmit = (values: EditUserFormValues) => {
    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('case-guardian-users') || '[]');
    
    // Find the user to update
    const userIndex = existingUsers.findIndex((u: User) => u.id === user.id);
    
    if (userIndex !== -1) {
      // Generate initials from updated name
      const initials = values.name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
        
      // Update the user
      existingUsers[userIndex] = {
        ...existingUsers[userIndex],
        name: values.name,
        email: values.email,
        role: values.role,
        department: values.department,
        status: values.status,
        initials: initials,
        permissions: values.permissions,
      };
      
      // Save back to localStorage
      localStorage.setItem('case-guardian-users', JSON.stringify(existingUsers));
      
      toast({
        title: "User updated successfully",
        description: `${values.name}'s information has been updated`,
      });
      
      // Trigger storage event to update UI
      window.dispatchEvent(new Event('storage'));
    }
    
    onOpenChange(false);
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
