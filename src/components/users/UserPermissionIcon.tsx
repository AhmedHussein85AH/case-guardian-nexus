
import { CheckCircle, XCircle } from "lucide-react";

interface UserPermissionIconProps {
  hasPermission: boolean;
}

export function UserPermissionIcon({ hasPermission }: UserPermissionIconProps) {
  return hasPermission ? (
    <CheckCircle className="h-4 w-4 text-green-500" />
  ) : (
    <XCircle className="h-4 w-4 text-red-500" />
  );
}
