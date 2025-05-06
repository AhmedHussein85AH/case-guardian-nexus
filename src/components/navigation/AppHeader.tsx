
import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/auth";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Notification, getAllNotifications, getUnreadNotificationsCount, markNotificationAsRead } from "@/services/dataService";

const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const loadNotifications = () => {
      const allNotifications = getAllNotifications();
      setNotifications(allNotifications);
      setUnreadCount(getUnreadNotificationsCount());
    };
    
    loadNotifications();
    
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "case-guardian-notifications") {
        loadNotifications();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  if (!user) return null;
  
  const handleNotificationClick = (notificationId: number) => {
    markNotificationAsRead(notificationId);
    navigate(`/notifications?id=${notificationId}`);
    setUnreadCount(getUnreadNotificationsCount());
    toast({
      title: "Opening notification",
      description: "Navigating to notification details",
    });
  };
  
  return (
    <header className="border-b border-border h-16 px-4 flex items-center justify-between bg-background/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center">
        <SidebarTrigger>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SidebarTrigger>
        <h1 className="text-xl font-semibold ml-4 hidden sm:block">Case Guardian Nexus</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">{unreadCount}</Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`cursor-pointer ${!notification.read ? 'bg-muted/50 font-medium' : ''}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/notifications" className="w-full">
                <Button variant="ghost" className="w-full justify-center">
                  View all notifications
                </Button>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 rounded-full" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <div className="mt-1">
                  <Badge variant="secondary" className="text-xs">{user.role}</Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/settings">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={logout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
