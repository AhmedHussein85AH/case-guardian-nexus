
import { Badge } from "@/components/ui/badge";

interface UserStatusBadgeProps {
  status: string;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  switch (status) {
    case "Active":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
    case "Away":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Away</Badge>;
    case "Inactive":
      return <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">Inactive</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
