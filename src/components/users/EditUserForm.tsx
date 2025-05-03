
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { PasswordField } from "./PasswordField";
import { UserPermissionsField } from "./UserPermissionsField";
import { UserStatusField } from "./UserStatusField";
import { departmentOptions, permissionItems, roleOptions, getDefaultPermissions } from "./userFormConfig";
import { editUserSchema, EditUserFormValues } from "./editUserSchema";

export type User = {
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

interface EditUserFormProps {
  user: User;
  onSubmit: (values: EditUserFormValues) => void;
  onCancel: () => void;
}

export function EditUserForm({ user, onSubmit, onCancel }: EditUserFormProps) {
  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
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
      const permissions = getDefaultPermissions(role);
  
      Object.keys(permissions).forEach(key => {
        form.setValue(`permissions.${key}` as any, permissions[key as keyof typeof permissions]);
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
          
          <PasswordField control={form.control} />
          
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
            <UserStatusField control={form.control} />
          </div>

          <UserPermissionsField 
            control={form.control}
            permissionItems={permissionItems}
          />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Update User</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
