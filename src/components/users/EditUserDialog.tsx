
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().optional(),
  role: z.string().min(1, { message: "Please select a role." }),
  department: z.string().min(1, { message: "Please select a department." }),
  status: z.string().min(1, { message: "Please select a status." }),
  permissions: z.object({
    viewCases: z.boolean().default(false),
    manageCases: z.boolean().default(false),
    viewReports: z.boolean().default(false),
    generateReports: z.boolean().default(false),
    viewUsers: z.boolean().default(false),
    manageUsers: z.boolean().default(false),
    viewMessages: z.boolean().default(false),
    manageSettings: z.boolean().default(false),
  }).default({
    viewCases: false,
    manageCases: false,
    viewReports: false,
    generateReports: false,
    viewUsers: false,
    manageUsers: false,
    viewMessages: false,
    manageSettings: false,
  }),
});

type FormValues = z.infer<typeof formSchema>;

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  initials: string;
  permissions?: {
    viewCases: boolean;
    manageCases: boolean;
    viewReports: boolean;
    generateReports: boolean;
    viewUsers: boolean;
    manageUsers: boolean;
    viewMessages: boolean;
    manageSettings: boolean;
  };
};

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      department: user.department,
      status: user.status,
      permissions: user.permissions || {
        viewCases: false,
        manageCases: false,
        viewReports: false,
        generateReports: false,
        viewUsers: false,
        manageUsers: false,
        viewMessages: false,
        manageSettings: false,
      },
    },
  });

  // Update form values when user changes
  useEffect(() => {
    form.reset({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      department: user.department,
      status: user.status,
      permissions: user.permissions || {
        viewCases: false,
        manageCases: false,
        viewReports: false,
        generateReports: false,
        viewUsers: false,
        manageUsers: false,
        viewMessages: false,
        manageSettings: false,
      },
    });
  }, [user, form]);

  const handleRoleChange = (role: string) => {
    // Only update permissions if they haven't been customized yet
    if (!user.permissions) {
      let permissions = {
        viewCases: false,
        manageCases: false,
        viewReports: false,
        generateReports: false,
        viewUsers: false,
        manageUsers: false,
        viewMessages: false,
        manageSettings: false,
      };
  
      if (role === "Admin") {
        permissions = {
          viewCases: true,
          manageCases: true,
          viewReports: true,
          generateReports: true,
          viewUsers: true,
          manageUsers: true,
          viewMessages: true,
          manageSettings: true,
        };
      } else if (role === "Manager") {
        permissions = {
          viewCases: true,
          manageCases: true,
          viewReports: true,
          generateReports: true,
          viewUsers: true,
          manageUsers: false,
          viewMessages: true,
          manageSettings: false,
        };
      } else if (role === "CCTV Operator") {
        permissions = {
          viewCases: true,
          manageCases: false,
          viewReports: false,
          generateReports: false,
          viewUsers: false,
          manageUsers: false,
          viewMessages: true,
          manageSettings: false,
        };
      }
  
      Object.keys(permissions).forEach(key => {
        form.setValue(`permissions.${key}` as any, permissions[key as keyof typeof permissions]);
      });
    }
  };

  const onSubmit = (values: FormValues) => {
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
    
    form.reset();
    onOpenChange(false);
  };

  const roleOptions = [
    { value: "Admin", label: "Admin" },
    { value: "Manager", label: "Manager" },
    { value: "CCTV Operator", label: "CCTV Operator" },
  ];

  const departmentOptions = [
    { value: "Admins", label: "Admins" },
    { value: "Managers", label: "Managers" },
    { value: "Operators", label: "Operators" },
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Away", label: "Away" },
    { value: "Inactive", label: "Inactive" },
  ];

  const permissionItems = [
    { id: "viewCases", label: "View Cases" },
    { id: "manageCases", label: "Manage Cases" },
    { id: "viewReports", label: "View Reports" },
    { id: "generateReports", label: "Generate Reports" },
    { id: "viewUsers", label: "View Users" },
    { id: "manageUsers", label: "Manage Users" },
    { id: "viewMessages", label: "View Messages" },
    { id: "manageSettings", label: "Manage Settings" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update the user details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password (leave blank to keep current)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleRoleChange(value);
                        }}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departmentOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border p-4 rounded-md">
                <h3 className="font-medium mb-3">User Permissions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {permissionItems.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name={`permissions.${item.id}` as any}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Update User</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
