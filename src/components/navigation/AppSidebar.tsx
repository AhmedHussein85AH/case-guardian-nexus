
import { useNavigate } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarFooter
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { 
  BarChart3, 
  FileText, 
  Inbox, 
  MessageSquare, 
  PlusCircle, 
  Search, 
  Settings, 
  ShieldAlert, 
  Users 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      path: "/dashboard",
    },
    {
      title: "Cases",
      icon: Inbox,
      path: "/cases",
    },
    {
      title: "New Case",
      icon: PlusCircle,
      path: "/cases/new",
    },
    {
      title: "Reports",
      icon: FileText,
      path: "/reports",
    },
    {
      title: "Search",
      icon: Search,
      path: "/search",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      path: "/messages",
    },
    {
      title: "Users",
      icon: Users,
      path: "/users",
    },
  ];

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="h-16 flex items-center px-4">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Case Guardian</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  onClick={() => navigate(item.path)}
                  className="flex items-center space-x-3"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border p-4">
        <div className="flex flex-col space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start"
            onClick={() => navigate("/settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="justify-start text-destructive hover:text-destructive/90"
            onClick={logout}
          >
            Sign out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
