
import { UserPermissions } from "./UserTypes";
import { UserPermissionIcon } from "./UserPermissionIcon";

interface UserPermissionsViewProps {
  permissions?: UserPermissions;
}

export function UserPermissionsView({ permissions }: UserPermissionsViewProps) {
  return (
    <div className="py-2 px-4">
      <h4 className="font-medium mb-2">User Permissions</h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="flex items-center gap-2">
          <UserPermissionIcon hasPermission={permissions?.viewCases ?? false} />
          <span>View Cases</span>
        </div>
        <div className="flex items-center gap-2">
          <UserPermissionIcon hasPermission={permissions?.manageCases ?? false} />
          <span>Manage Cases</span>
        </div>
        <div className="flex items-center gap-2">
          <UserPermissionIcon hasPermission={permissions?.viewReports ?? false} />
          <span>View Reports</span>
        </div>
        <div className="flex items-center gap-2">
          <UserPermissionIcon hasPermission={permissions?.generateReports ?? false} />
          <span>Generate Reports</span>
        </div>
        <div className="flex items-center gap-2">
          <UserPermissionIcon hasPermission={permissions?.viewUsers ?? false} />
          <span>View Users</span>
        </div>
        <div className="flex items-center gap-2">
          <UserPermissionIcon hasPermission={permissions?.manageUsers ?? false} />
          <span>Manage Users</span>
        </div>
        <div className="flex items-center gap-2">
          <UserPermissionIcon hasPermission={permissions?.viewMessages ?? false} />
          <span>View Messages</span>
        </div>
        <div className="flex items-center gap-2">
          <UserPermissionIcon hasPermission={permissions?.manageSettings ?? false} />
          <span>Manage Settings</span>
        </div>
      </div>
    </div>
  );
}
