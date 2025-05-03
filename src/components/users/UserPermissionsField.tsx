
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Control } from "react-hook-form";

type PermissionItem = {
  id: string;
  label: string;
};

interface UserPermissionsFieldProps {
  control: Control<any>;
  permissionItems: PermissionItem[];
}

export function UserPermissionsField({ control, permissionItems }: UserPermissionsFieldProps) {
  return (
    <div className="border p-4 rounded-md">
      <h3 className="font-medium mb-3">User Permissions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {permissionItems.map((item) => (
          <FormField
            key={item.id}
            control={control}
            name={`permissions.${item.id}` as any}
            render={({ field }) => (
              <FormItem
                className="flex flex-row items-start space-x-3 space-y-0"
              >
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
  );
}
