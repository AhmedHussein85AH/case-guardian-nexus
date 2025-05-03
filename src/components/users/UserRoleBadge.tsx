
import { Badge } from "@/components/ui/badge";

interface UserRoleBadgeProps {
  role: string;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  switch (role) {
    case "Admin":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Admin</Badge>;
    case "Manager":
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Manager</Badge>;
    case "CCTV Operator":
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">CCTV Operator</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
}
