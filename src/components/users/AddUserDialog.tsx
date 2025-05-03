
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { UserForm } from "./UserForm";
import { UserFormValues } from "./userFormSchema";

export function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (values: UserFormValues) => {
    // Generate new user data with an ID and initials
    const initials = values.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
      
    const newUser = {
      id: Date.now(),
      name: values.name,
      email: values.email,
      role: values.role,
      department: values.department,
      status: "Active",
      initials: initials,
      permissions: values.permissions,
    };
    
    // Get existing users from localStorage or create empty array
    const existingUsers = JSON.parse(localStorage.getItem('case-guardian-users') || '[]');
    
    // Add new user
    existingUsers.push(newUser);
    
    // Save back to localStorage
    localStorage.setItem('case-guardian-users', JSON.stringify(existingUsers));
    
    toast({
      title: "User added successfully",
      description: `${values.name} has been added as a ${values.role}`,
    });
    
    setOpen(false);
    
    // Trigger storage event to update UI
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new user account.
          </DialogDescription>
        </DialogHeader>
        <UserForm 
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
